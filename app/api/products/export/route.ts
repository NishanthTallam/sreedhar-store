import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import { stringify } from "csv-stringify/sync";

export async function GET() {
  try {
    await requireAdmin();

    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: true,
      },
      orderBy: { name: "asc" },
    });

    const rows = [];
    // Define headers
    rows.push(["Product ID", "Name", "Slug", "Description", "Category", "Brand", "Is Returnable", "Is Active", "Variant SKU", "Variant Label", "Variant Unit", "Variant Price", "Variant Stock", "Variant Low Stock At"]);

    for (const p of products) {
      if (p.variants.length === 0) {
        rows.push([p.id, p.name, p.slug, p.description || "", p.category.name, p.brand?.name || "", p.isReturnable ? "yes" : "no", p.isActive ? "yes" : "no", "", "", "", "", "", ""]);
      } else {
        for (const v of p.variants) {
          rows.push([p.id, p.name, p.slug, p.description || "", p.category.name, p.brand?.name || "", p.isReturnable ? "yes" : "no", p.isActive ? "yes" : "no", v.sku, v.label, v.unit, v.price.toString(), v.stock.toString(), v.lowStockAt.toString()]);
        }
      }
    }

    const csvData = stringify(rows);

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="products_export.csv"',
      },
    });
  } catch (error) {
    console.error("[PRODUCTS_EXPORT]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or failed to export products" }, { status: 500 });
  }
}