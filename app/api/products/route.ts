import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators/product";
import { requireAdmin } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const brandId = searchParams.get("brandId");
    const search = searchParams.get("search");

    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const { name, slug, description, brandId, categoryId, isReturnable, isActive, images, variants } = parsed.data;

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        brandId: brandId || null,
        categoryId,
        isReturnable,
        isActive,
        images,
        variants: {
          create: variants.map((v) => ({
            label: v.label,
            unit: v.unit,
            price: v.price,
            stock: v.stock,
            lowStockAt: v.lowStockAt,
            sku: v.sku,
          })),
        },
      },
      include: {
        variants: true,
      }
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or server error" }, { status: 401 });
  }
}