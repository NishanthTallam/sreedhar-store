import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import Papa from "papaparse";

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const result = Papa.parse(text, { header: true, skipEmptyLines: true });

    if (result.errors.length > 0) {
      return NextResponse.json({ success: false, error: "Error parsing CSV", details: result.errors }, { status: 400 });
    }

    // A real import route needs robust error handling and validation.
    // For this implementation, we will process row by row and assume standard headers.
    let importedCount = 0;
    
    // Simplistic processing
    for (const row of result.data as any[]) {
      if (!row.Name || !row.Slug || !row.Category) continue; // Basic validation
      
      const category = await prisma.category.findFirst({ where: { name: row.Category } });
      let brandId = null;
      if (row.Brand) {
        const brand = await prisma.brand.findFirst({ where: { name: row.Brand } });
        if (brand) brandId = brand.id;
      }

      if (!category) continue; // Skip if category not found

      // Upsert product by slug
      let product = await prisma.product.findUnique({ where: { slug: row.Slug } });
      
      if (!product) {
        product = await prisma.product.create({
          data: {
            name: row.Name,
            slug: row.Slug,
            description: row.Description || null,
            categoryId: category.id,
            brandId: brandId,
            isActive: row["Is Active"]?.toLowerCase() === "yes" || row["Is Active"] === "true",
            isReturnable: row["Is Returnable"]?.toLowerCase() === "yes" || row["Is Returnable"] === "true",
          }
        });
      }

      // Add variant if present
      if (row["Variant SKU"]) {
        await prisma.variant.upsert({
          where: { sku: row["Variant SKU"] },
          create: {
            productId: product.id,
            sku: row["Variant SKU"],
            label: row["Variant Label"] || "Default",
            unit: row["Variant Unit"] || "pcs",
            price: parseFloat(row["Variant Price"]) || 0,
            stock: parseInt(row["Variant Stock"]) || 0,
            lowStockAt: parseInt(row["Variant Low Stock At"]) || 10,
          },
          update: {
            price: parseFloat(row["Variant Price"]) || 0,
            stock: parseInt(row["Variant Stock"]) || 0,
            lowStockAt: parseInt(row["Variant Low Stock At"]) || 10,
          }
        });
      }
      importedCount++;
    }

    return NextResponse.json({ success: true, data: { importedRows: importedCount } });
  } catch (error) {
    console.error("[PRODUCTS_IMPORT]", error);
    return NextResponse.json({ success: false, error: "Failed to import products" }, { status: 500 });
  }
}