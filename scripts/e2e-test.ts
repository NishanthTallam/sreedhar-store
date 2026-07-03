import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting E2E Test...");

  // 1. Clean up old test data
  await prisma.user.deleteMany({
    where: { email: { startsWith: "test_e2e" } },
  });
  
  // Create Test Users
  const customer = await prisma.user.create({
    data: {
      name: "E2E Customer",
      email: "test_e2e_customer@example.com",
      role: "CUSTOMER",
      addresses: {
        create: {
          fullName: "E2E Customer",
          mobile: "9999999999",
          houseNo: "123",
          street: "E2E Street",
          city: "Test City",
          state: "TS",
          pincode: "500001",
        }
      }
    },
    include: { addresses: true }
  });

  const deliveryBoy = await prisma.user.create({
    data: {
      name: "E2E Delivery Boy",
      email: "test_e2e_delivery@example.com",
      role: "DELIVERY_BOY",
    }
  });

  // 2. Setup Cart with a product
  const variant = await prisma.variant.findFirst();
  if (!variant) throw new Error("No variants found in DB. Run seed first.");

  const address = customer.addresses[0];

  console.log(`Initial stock for variant ${variant.id}: ${variant.stock}`);

  const cart = await prisma.cart.create({
    data: {
      userId: customer.id,
      items: {
        create: {
          variantId: variant.id,
          quantity: 2,
        }
      }
    },
    include: { items: { include: { variant: true } } }
  });

  // 3. Simulate Order Placement (What the API does)
  console.log("Placing order...");
  const subtotal = Number(variant.price) * 2;
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  
  const order = await prisma.$transaction(async (tx) => {
    // Check stock
    const v = await tx.variant.findUnique({ where: { id: variant.id }});
    if (!v || v.stock < 2) throw new Error("Insufficient stock");

    const newOrder = await tx.order.create({
      data: {
        orderNumber: `ORD-E2E-${Date.now().toString().slice(-6)}`,
        userId: customer.id,
        addressId: address.id,
        subtotal,
        deliveryCharge,
        discountAmount: 0,
        totalAmount: subtotal + deliveryCharge,
        paymentMethod: "COD",
        status: "PLACED",
        items: {
          create: [{
            variantId: variant.id,
            quantity: 2,
            priceAtOrder: variant.price
          }]
        },
        statusHistory: {
          create: { status: "PLACED" }
        }
      }
    });

    await tx.variant.update({
      where: { id: variant.id },
      data: { stock: { decrement: 2 } }
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    
    return newOrder;
  }, { timeout: 15000 });

  console.log(`Order placed successfully: ${order.orderNumber}`);
  const postOrderVariant = await prisma.variant.findUnique({ where: { id: variant.id } });
  console.log(`Stock after order: ${postOrderVariant?.stock} (Expected: ${variant.stock - 2})`);

  if (postOrderVariant?.stock !== variant.stock - 2) {
    throw new Error("Stock was not decremented correctly");
  }

  // 4. Simulate Admin Confirming Order
  console.log("Admin confirming order...");
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "CONFIRMED" }
  });
  await prisma.orderStatusLog.create({
    data: { orderId: order.id, status: "CONFIRMED" }
  });

  // 5. Simulate Admin Packing Order
  console.log("Admin packing order...");
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PACKED" }
  });

  // 6. Simulate Admin Assigning Delivery Boy
  console.log("Admin assigning delivery boy...");
  await prisma.order.update({
    where: { id: order.id },
    data: { deliveryBoyId: deliveryBoy.id }
  });

  // 7. Simulate Delivery Boy updating status
  console.log("Delivery boy updating to OUT_FOR_DELIVERY...");
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "OUT_FOR_DELIVERY" }
  });
  
  console.log("Delivery boy updating to DELIVERED...");
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "DELIVERED" }
  });

  // 8. Simulate Customer Return Request
  console.log("Customer requesting return...");
  const orderItem = await prisma.orderItem.findFirst({ where: { orderId: order.id } });
  if (!orderItem) throw new Error("Order item not found");

  const returnReq = await prisma.returnRequest.create({
    data: {
      orderId: order.id,
      orderItemId: orderItem.id,
      reason: "Defective item",
    }
  });
  console.log(`Return requested successfully: ${returnReq.id}`);

  console.log("✅ E2E Test completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
