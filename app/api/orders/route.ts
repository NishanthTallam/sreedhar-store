import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { calculateDiscount } from "@/lib/coupons";
import { sendMail } from "@/lib/mailer";
import { generateOrderConfirmationEmail } from "@/emails/order-confirmation";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { addressId, paymentMethod } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        coupon: true,
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId, userId: session.user.id }
    });

    if (!address) {
      return NextResponse.json({ success: false, error: "Invalid address" }, { status: 400 });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.variant.price) * item.quantity), 0);
    const deliveryCharge = subtotal > 500 ? 0 : 50; // Stub, assuming free delivery above 500
    let discountAmount = 0;

    if (cart.coupon) {
      discountAmount = calculateDiscount(cart.coupon, subtotal);
    }

    const totalAmount = subtotal + deliveryCharge - discountAmount;

    // Use Prisma transaction for order placement
    const order = await prisma.$transaction(async (tx) => {
      // 1. Check stock
      for (const item of cart.items) {
        if (item.variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.variant.product.name} (${item.variant.label})`);
        }
      }

      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          userId: session.user.id,
          addressId: address.id,
          subtotal,
          deliveryCharge,
          couponId: cart.couponId,
          discountAmount,
          totalAmount,
          paymentMethod,
          items: {
            create: cart.items.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtOrder: item.variant.price,
            }))
          },
          statusHistory: {
            create: { status: 'PLACED' }
          }
        },
        include: {
          items: { include: { variant: { include: { product: true } } } },
          user: true,
        }
      });

      // 3. Decrement Stock and write StockHistory
      for (const item of cart.items) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });

        await tx.stockHistory.create({
          data: {
            variantId: item.variantId,
            change: -item.quantity,
            reason: `Order placed (${newOrder.orderNumber})`,
          }
        });
      }

      // 4. Update coupon usage
      if (cart.couponId) {
        await tx.coupon.update({
          where: { id: cart.couponId },
          data: { usedCount: { increment: 1 } }
        });
      }

      // 5. Clear Cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({ where: { id: cart.id }, data: { couponId: null } });

      return newOrder;
    });

    // 6. Send Email Notification (Async)
    const emailHtml = generateOrderConfirmationEmail(
      order.orderNumber,
      order.user.name,
      order.items.map(i => ({
        name: i.variant.product.name,
        variantLabel: i.variant.label,
        quantity: i.quantity,
        price: Number(i.priceAtOrder) * i.quantity
      })),
      Number(order.totalAmount)
    );

    await sendMail({
      to: order.user.email,
      subject: `Order Confirmed: ${order.orderNumber}`,
      html: emailHtml,
    }).catch(console.error);

    // 7. Write Notification record
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        category: 'ORDERS',
        title: 'Order Placed successfully',
        body: `Your order ${order.orderNumber} has been placed. We'll update you when it ships!`,
      }
    });

    return NextResponse.json({ success: true, data: { orderId: order.id, orderNumber: order.orderNumber } }, { status: 201 });
  } catch (error: any) {
    console.error("[ORDERS_POST]", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to place order" }, { status: 500 });
  }
}