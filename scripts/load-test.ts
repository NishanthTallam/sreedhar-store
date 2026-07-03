import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Concurrency Load Test...");

  // 1. Setup Data
  const brand = await prisma.brand.findFirst();
  const category = await prisma.category.findFirst();
  if (!brand || !category) throw new Error("Run seed first");

  const product = await prisma.product.create({
    data: {
      name: "Load Test Product",
      slug: `load-test-${Date.now()}`,
      brandId: brand.id,
      categoryId: category.id,
      variants: {
        create: [{ label: "1 Unit", unit: "unit", price: 100, stock: 1, sku: `LOAD-TEST-SKU-${Date.now()}` }]
      }
    },
    include: { variants: true }
  });

  const variant = product.variants[0];

  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => 
      prisma.user.create({
        data: {
          name: `Load Test User ${i}`,
          email: `test_load_${Date.now()}_${i}@example.com`,
          addresses: {
            create: {
              fullName: "Test",
              mobile: "999",
              houseNo: "1",
              street: "Test",
              city: "Test",
              state: "TS",
              pincode: "111",
            }
          }
        },
        include: { addresses: true }
      })
    )
  );

  const coupon = await prisma.coupon.create({
    data: {
      code: `LOADTEST-${Date.now()}`,
      type: "FLAT",
      value: 10,
      usageLimit: 1,
      usedCount: 0,
      isActive: true,
    }
  });

  // 2. Add to Carts
  await Promise.all(users.map(u => 
    prisma.cart.create({
      data: {
        userId: u.id,
        couponId: coupon.id, // all users apply the same limited coupon
        items: {
          create: { variantId: variant.id, quantity: 1 }
        }
      }
    })
  ));

  // 3. Fire concurrent order placements
  console.log("Firing 10 concurrent order placement requests for 1 stock item...");
  
  // We simulate the transaction logic inside the API route.
  // In reality, the API route does this same transaction.
  const placeOrder = async (userId: string, addressId: string, cartId: string) => {
    return await prisma.$transaction(async (tx) => {
      // Re-fetch variant for stock check
      const v = await tx.variant.findUnique({ where: { id: variant.id } });
      if (!v || v.stock < 1) throw new Error("Insufficient stock");

      // Check coupon
      const c = await tx.coupon.findUnique({ where: { id: coupon.id } });
      if (!c || (c.usageLimit !== null && c.usedCount >= c.usageLimit)) {
        throw new Error("Coupon limit reached");
      }

      const order = await tx.order.create({
        data: {
          orderNumber: `ORD-LOAD-${Date.now().toString().slice(-6)}-${userId.slice(0,4)}`,
          userId,
          addressId,
          subtotal: 100,
          deliveryCharge: 50,
          discountAmount: 10,
          totalAmount: 140,
          paymentMethod: "COD",
          couponId: c.id,
          items: {
            create: [{ variantId: variant.id, quantity: 1, priceAtOrder: 100 }]
          },
          statusHistory: { create: { status: "PLACED" } }
        }
      });

      await tx.variant.update({
        where: { id: variant.id },
        data: { stock: { decrement: 1 } }
      });
      
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } }
      });

      await tx.cartItem.deleteMany({ where: { cartId } });

      return order;
    }, { isolationLevel: 'Serializable', timeout: 30000 });
  };

  const results = await Promise.allSettled(
    users.map(async (u) => {
      const cart = await prisma.cart.findUnique({ where: { userId: u.id } });
      return placeOrder(u.id, u.addresses[0].id, cart!.id);
    })
  );

  // 4. Analyze Results
  const successful = results.filter(r => r.status === "fulfilled");
  const failed = results.filter(r => r.status === "rejected");

  console.log(`Results: ${successful.length} successful, ${failed.length} failed.`);

  const finalVariant = await prisma.variant.findUnique({ where: { id: variant.id } });
  const finalCoupon = await prisma.coupon.findUnique({ where: { id: coupon.id } });

  console.log(`Final stock: ${finalVariant?.stock} (Expected: 0)`);
  console.log(`Final coupon usage: ${finalCoupon?.usedCount} (Expected: 1)`);

  if (successful.length !== 1 || finalVariant?.stock !== 0 || finalCoupon?.usedCount !== 1) {
    throw new Error("Concurrency failure! Race condition detected.");
  }

  console.log("✅ Load Test completed successfully! No race conditions.");

  // Cleanup
  await prisma.order.deleteMany({ where: { userId: { in: users.map(u => u.id) } } });
  await prisma.user.deleteMany({ where: { id: { in: users.map(u => u.id) } } });
  await prisma.product.delete({ where: { id: product.id } });
  await prisma.coupon.delete({ where: { id: coupon.id } });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
