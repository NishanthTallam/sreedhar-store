import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators/product";
import { requireAdmin } from "@/lib/rbac";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });

    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const { name, slug, description, brandId, categoryId, isReturnable, isActive, images, variants } = parsed.data;

    // Check slug uniqueness excluding current product
    const existing = await prisma.product.findFirst({ where: { slug, id: { not: id } } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }

    // Delete existing variants and recreate them for simplicity
    // A more complex approach would be to update existing, but delete/recreate is robust for full-replace
    const product = await prisma.$transaction(async (tx) => {
      await tx.variant.deleteMany({ where: { productId: id } });
      return tx.product.update({
        where: { id },
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
              mrpPrice: v.mrpPrice,
              discount: v.discount,
              stock: v.stock,
              lowStockAt: v.lowStockAt,
              sku: v.sku,
              barcode: v.barcode || null,
            })),
          },
        },
        include: {
          variants: true,
        },
      });
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[PRODUCT_PUT]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or server error" }, { status: 401 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
