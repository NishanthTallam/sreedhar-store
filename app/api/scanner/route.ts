import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, error: "No barcode provided" }, { status: 400 });
    }

    // Search by barcode or sku exact match
    const variant = await prisma.variant.findFirst({
      where: {
        OR: [
          { barcode: code },
          { sku: code }
        ]
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            category: { select: { name: true } },
            brand: { select: { name: true } },
          }
        }
      }
    });

    if (!variant) {
      return NextResponse.json({ success: false, error: "No product found for this barcode" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: variant });
  } catch (error) {
    console.error("[SCANNER_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to process barcode" }, { status: 500 });
  }
}
