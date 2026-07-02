import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";

export async function GET() {
  try {
    await requireAdmin();
    
    // Fetch all variants with their product details
    const inventory = await prisma.variant.findMany({
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            category: { select: { name: true } },
            brand: { select: { name: true } },
          }
        }
      },
      orderBy: {
        product: { name: "asc" }
      }
    });

    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    console.error("[INVENTORY_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 });
  }
}