import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";
import { sendOrderStatusEmail } from "@/lib/mailer";
import { z } from "zod";

const statusUpdateSchema = z.object({
  status: z.enum([
    "PLACED",
    "CONFIRMED",
    "PACKED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REJECTED",
  ]),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const status = formData.get("status") as string;
    
    const parsed = statusUpdateSchema.safeParse({ status });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const newStatus = parsed.data.status;
    const userRole = (session.user as Record<string, unknown>).role as string;
    
    // Fetch order first to check permissions and state
    const order = await prisma.order.findUnique({
      where: { id: (await context.params).id },
      include: { user: true, items: { include: { variant: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Role-based logic
    if (userRole === "CUSTOMER") {
      // Customers can only cancel their own orders, and only up to CONFIRMED
      if (order.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (newStatus !== "CANCELLED") {
        return NextResponse.json({ error: "Customers can only cancel orders" }, { status: 403 });
      }
      if (order.status !== "PLACED" && order.status !== "CONFIRMED") {
        return NextResponse.json({ error: "Cannot cancel order at this stage" }, { status: 400 });
      }
    } else if (userRole === "DELIVERY_BOY") {
      // Delivery boy can only update their assigned orders
      if (order.deliveryBoyId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (!["OUT_FOR_DELIVERY", "DELIVERED"].includes(newStatus)) {
        return NextResponse.json({ error: "Delivery boy cannot set this status" }, { status: 403 });
      }
    } else if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Process update in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Update order status
      const updateData: any = { status: newStatus };
      if (newStatus === "CANCELLED") {
        updateData.cancelledAt = new Date();
      } else if (newStatus === "REJECTED") {
        updateData.rejectedAt = new Date();
      }

      await tx.order.update({
        where: { id: (await context.params).id },
        data: updateData,
      });

      // Write status log
      await tx.orderStatusLog.create({
        data: {
          orderId: order.id,
          status: newStatus,
          changedBy: session.user.id,
        },
      });

      // Write in-app notification
      await tx.notification.create({
        data: {
          userId: order.userId,
          category: "ORDERS",
          title: `Order ${newStatus}`,
          body: `Your order #${order.orderNumber} status is now ${newStatus.replace(/_/g, " ")}.`,
        }
      });
      
      // If cancelled or rejected, refund stock
      if ((newStatus === "CANCELLED" || newStatus === "REJECTED") && order.status !== "CANCELLED" && order.status !== "REJECTED") {
        for (const item of order.items) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } }
          });
          await tx.stockHistory.create({
            data: {
              variantId: item.variantId,
              change: item.quantity,
              reason: `Order ${newStatus.toLowerCase()} restock`,
              changedBy: session.user.id
            }
          });
        }
      }
    });

    // Write audit log
    await writeAuditLog({
      userId: session.user.id,
      action: "ORDER_STATUS_CHANGED",
      entityType: "Order",
      entityId: order.id,
      metadata: { oldStatus: order.status, newStatus },
    });

    // Fire & forget email (do not await to avoid blocking response)
    sendOrderStatusEmail(
      order.user.email,
      order.orderNumber,
      newStatus,
      order.user.name
    ).catch(console.error);

    // Redirect based on role
    if (userRole === "CUSTOMER") {
      return NextResponse.redirect(new URL(`/account/orders/${order.id}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/admin/orders/${order.id}`, request.url));
    }
  } catch (error) {
    console.error("[OrderStatusUpdate] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}