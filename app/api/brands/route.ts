import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validators/brand";
import { requireAdmin } from "@/lib/rbac";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error("[BRANDS_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = brandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const { name, slug, logoUrl } = parsed.data;

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logoUrl,
      },
    });

    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    console.error("[BRANDS_POST]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or server error" }, { status: 401 });
  }
}