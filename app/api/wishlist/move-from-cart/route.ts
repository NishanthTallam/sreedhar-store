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

    const { cartItemId, productId } = await req.json();

    if (!cartItemId || !productId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Remove from cart
      const cart = await tx.cart.findUnique({ where: { userId: session.user.id } });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { id: cartItemId, cartId: cart.id }
        });
      }

      // 2. Add to wishlist
      const existingWishlistItem = await tx.wishlistItem.findUnique({
        where: { userId_productId: { userId: session.user.id, productId } }
      });

      if (!existingWishlistItem) {
        await tx.wishlistItem.create({
          data: { userId: session.user.id, productId }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WISHLIST_MOVE_FROM_CART]", error);
    return NextResponse.json({ success: false, error: "Failed to move to wishlist" }, { status: 500 });
  }
}
