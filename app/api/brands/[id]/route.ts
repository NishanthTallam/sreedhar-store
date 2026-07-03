import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validators/brand";
import { requireAdmin } from "@/lib/rbac";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!brand) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error("[BRAND_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch brand" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const parsed = brandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const { name, slug, logoUrl } = parsed.data;

    // Check slug uniqueness (excluding current brand)
    const existing = await prisma.brand.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: { name, slug, logoUrl },
    });

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error("[BRAND_PUT]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or server error" }, { status: 401 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check for attached products
    const productCount = await prisma.product.count({ where: { brandId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete: ${productCount} product(s) are linked to this brand.` },
        { status: 400 }
      );
    }

    await prisma.brand.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Brand deleted" });
  } catch (error) {
    console.error("[BRAND_DELETE]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or server error" }, { status: 401 });
  }
}
