import { PrismaClient } from "@prisma/client";
import { auth } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- 1. Admin User ---
  const adminEmail = "tallamnishanth@gmail.com";
  const adminPassword = "Nishanth@2005";
  const adminName = "Nishanth";

  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminUser) {
    console.log("Creating new admin user...");
    const res = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      }
    });

    if (!res?.user) {
      throw new Error(`Failed to create admin`);
    }

    await prisma.user.update({
      where: { email: adminEmail },
      data: { 
        role: "ADMIN",
        emailVerified: true
      }
    });
    console.log("✅ Admin account created successfully!");
  } else {
    console.log("Admin account already exists. Skipping.");
  }

  // --- 2. Categories ---
  console.log("Seeding categories...");
  const categoriesData = [
    { name: "Fresh Vegetables", slug: "fresh-vegetables", imageUrl: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80" },
    { name: "Fresh Fruits", slug: "fresh-fruits", imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80" },
    { name: "Dairy & Bakery", slug: "dairy-bakery", imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80" },
    { name: "Staples", slug: "staples", imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80" },
    { name: "Snacks & Branded Foods", slug: "snacks", imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&q=80" },
    { name: "Beverages", slug: "beverages", imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" },
    { name: "Personal Care", slug: "personal-care", imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80" },
    { name: "Home Care", slug: "home-care", imageUrl: "https://images.unsplash.com/photo-1584820927498-cafe4c10c660?w=500&q=80" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // --- 3. Brands ---
  console.log("Seeding brands...");
  const brandsData = [
    { name: "FarmFresh", slug: "farmfresh" },
    { name: "Amul", slug: "amul" },
    { name: "Aashirvaad", slug: "aashirvaad" },
    { name: "Britannia", slug: "britannia" },
  ];

  for (const brand of brandsData) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }

  // --- 4. Products & Variants ---
  console.log("Seeding products and variants...");
  const vegetables = await prisma.category.findUnique({ where: { slug: "fresh-vegetables" } });
  const dairy = await prisma.category.findUnique({ where: { slug: "dairy-bakery" } });
  const staples = await prisma.category.findUnique({ where: { slug: "staples" } });
  
  const amul = await prisma.brand.findUnique({ where: { slug: "amul" } });
  const aashirvaad = await prisma.brand.findUnique({ where: { slug: "aashirvaad" } });
  const farmFresh = await prisma.brand.findUnique({ where: { slug: "farmfresh" } });

  const productsData = [
    {
      name: "Fresh Red Onion",
      slug: "fresh-red-onion",
      description: "Crisp, sweet, and pungent red onions.",
      categoryId: vegetables!.id,
      brandId: farmFresh!.id,
      images: ["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80"],
      isActive: true,
      variants: [
        { label: "1", unit: "kg", price: 40, stock: 100, sku: "ONION-1KG" },
        { label: "5", unit: "kg", price: 190, stock: 50, sku: "ONION-5KG" },
      ]
    },
    {
      name: "Amul Taaza Homogenised Toned Milk",
      slug: "amul-taaza-milk",
      description: "Long life toned milk.",
      categoryId: dairy!.id,
      brandId: amul!.id,
      images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80"], // using a generic milk image
      isActive: true,
      variants: [
        { label: "1", unit: "L", price: 68, stock: 200, sku: "AMUL-MILK-1L" },
      ]
    },
    {
      name: "Aashirvaad Shudh Chakki Atta",
      slug: "aashirvaad-atta",
      description: "100% whole wheat atta.",
      categoryId: staples!.id,
      brandId: aashirvaad!.id,
      images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80"], // generic flour image
      isActive: true,
      variants: [
        { label: "5", unit: "kg", price: 240, stock: 150, sku: "AASH-ATTA-5KG" },
        { label: "10", unit: "kg", price: 450, stock: 80, sku: "AASH-ATTA-10KG" },
      ]
    },
    {
      name: "Fresh Potato",
      slug: "fresh-potato",
      description: "Farm fresh potatoes.",
      categoryId: vegetables!.id,
      brandId: farmFresh!.id,
      images: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80"],
      isActive: true,
      variants: [
        { label: "1", unit: "kg", price: 30, stock: 300, sku: "POTATO-1KG" },
      ]
    }
  ];

  for (const prod of productsData) {
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          categoryId: prod.categoryId,
          brandId: prod.brandId,
          images: prod.images,
          isActive: prod.isActive,
          variants: {
            create: prod.variants
          }
        }
      });
    }
  }

  // --- 5. Banners ---
  console.log("Seeding banners...");
  const banners = [
    {
      type: "HOMEPAGE" as const,
      title: "Fresh Groceries Delivered Fast",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
      linkUrl: "/products",
      isActive: true
    },
    {
      type: "OFFER" as const,
      title: "50% Off on Fresh Fruits",
      imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=80",
      linkUrl: "/category/fresh-fruits",
      isActive: true
    }
  ];

  for (const banner of banners) {
    const existing = await prisma.banner.findFirst({ where: { title: banner.title } });
    if (!existing) {
      await prisma.banner.create({ data: banner });
    }
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
