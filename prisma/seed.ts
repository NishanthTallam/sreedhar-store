// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing catalog data (optional, but good for idempotency)
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  // 2. Create Categories
  const groceries = await prisma.category.create({
    data: { name: "Groceries", slug: "groceries", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" }
  });
  const snacks = await prisma.category.create({
    data: { name: "Snacks", slug: "snacks", imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80" }
  });
  const beverages = await prisma.category.create({
    data: { name: "Beverages", slug: "beverages", imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80" }
  });

  // 3. Create Brands
  const nestle = await prisma.brand.create({
    data: { name: "Nestlé", slug: "nestle" }
  });
  const amul = await prisma.brand.create({
    data: { name: "Amul", slug: "amul" }
  });
  const localBrand = await prisma.brand.create({
    data: { name: "Local Harvest", slug: "local-harvest" }
  });

  // 4. Create Products and Variants
  await prisma.product.create({
    data: {
      name: "Maggi 2-Minute Noodles",
      slug: "maggi-2-minute-noodles",
      description: "Classic instant noodles.",
      brandId: nestle.id,
      categoryId: snacks.id,
      images: ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80"],
      variants: {
        create: [
          { label: "70g", unit: "g", price: 14.0, stock: 100, sku: "MAGGI-70G" },
          { label: "140g", unit: "g", price: 28.0, stock: 50, sku: "MAGGI-140G" },
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: "Amul Taaza Milk",
      slug: "amul-taaza-milk",
      description: "Fresh toned milk.",
      brandId: amul.id,
      categoryId: beverages.id,
      images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80"],
      variants: {
        create: [
          { label: "500ml", unit: "ml", price: 26.0, stock: 40, sku: "AMUL-MILK-500ML" },
          { label: "1L", unit: "L", price: 52.0, stock: 30, sku: "AMUL-MILK-1L" },
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: "Organic Toor Dal",
      slug: "organic-toor-dal",
      description: "Premium quality unpolished toor dal.",
      brandId: localBrand.id,
      categoryId: groceries.id,
      images: ["https://images.unsplash.com/photo-1585918732007-8025ed9f848c?w=800&q=80"],
      variants: {
        create: [
          { label: "500g", unit: "g", price: 85.0, stock: 60, sku: "TOORDAL-500G" },
          { label: "1kg", unit: "kg", price: 160.0, stock: 80, sku: "TOORDAL-1KG" },
        ]
      }
    }
  });

  console.log("Database seeded successfully!");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
