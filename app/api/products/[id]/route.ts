import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators/product";
import { requireAdmin } from "@/lib/rbac";
import { pusherServer } from "@/lib/pusher";

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

    const product = await prisma.$transaction(async (tx) => {
      // 1. Handle variant deletions safely
      const existingVariants = await tx.variant.findMany({ where: { productId: id } });
      const incomingIds = variants.map((v: any) => v.id).filter(Boolean);
      const variantsToDelete = existingVariants.filter(v => !incomingIds.includes(v.id));

      await Promise.all(variantsToDelete.map(async (v) => {
        // Prevent deletion if the variant is part of an order
        const hasOrders = await tx.orderItem.findFirst({ where: { variantId: v.id } });
        if (hasOrders) {
          throw new Error(`Cannot delete variant "${v.label}" because it has been ordered by customers. Please disable the product or update the variant's stock to 0 instead.`);
        }
        
        // Remove from carts first to satisfy foreign key constraint
        await tx.cartItem.deleteMany({ where: { variantId: v.id } });
        await tx.variant.delete({ where: { id: v.id } });
      }));

      // 2. Upsert incoming variants
      await Promise.all(variants.map(async (v: any) => {
        const variantData = {
          label: v.label,
          unit: v.unit,
          price: Math.max(0, (v.mrpPrice || 0) - (v.discount || 0)),
          mrpPrice: v.mrpPrice,
          discount: v.discount,
          stock: v.stock,
          lowStockAt: v.lowStockAt,
          sku: v.sku,
          barcode: v.barcode || null,
        };

        if (v.id) {
          await tx.variant.update({
            where: { id: v.id },
            data: variantData,
          });
        } else {
          await tx.variant.create({
            data: {
              ...variantData,
              productId: id,
            },
          });
        }
      }));

      // 3. Update the main product
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
        },
        include: {
          variants: true,
        },
      });
    }, {
      maxWait: 5000,
      timeout: 20000
    });

    try {
      await pusherServer.trigger("store-public", "product_updated", { id });
    } catch (e) {
      console.error("[Pusher Product Update Error]", e);
    }

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
