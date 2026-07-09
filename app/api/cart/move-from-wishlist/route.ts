import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { variantId, productId } = await req.json();

    if (!variantId || !productId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Remove from wishlist
      await tx.wishlistItem.deleteMany({
        where: { userId: session.user.id, productId }
      });

      // 2. Add to cart
      // Ensure cart exists
      let cart = await tx.cart.findUnique({ where: { userId: session.user.id } });
      if (!cart) {
        cart = await tx.cart.create({ data: { userId: session.user.id } });
      }

      // Upsert cart item
      const existingItem = await tx.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId } }
      });

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + 1 }
        });
      } else {
        await tx.cartItem.create({
          data: { cartId: cart.id, variantId, quantity: 1 }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_MOVE_FROM_WISHLIST]", error);
    return NextResponse.json({ success: false, error: "Failed to move to cart" }, { status: 500 });
  }
}
