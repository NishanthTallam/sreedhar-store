import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        },
        coupon: true,
      }
    });

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error("[CART_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { variantId, quantity } = await req.json();

    // Ensure cart exists
    let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.user.id } });
    }

    // Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity: quantity || 1 }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json({ success: false, error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, quantity } = await req.json();
    
    // Ensure the item belongs to this user's cart
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) throw new Error("Cart not found");

    await prisma.cartItem.update({
      where: { id, cartId: cart.id },
      data: { quantity }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_PUT]", error);
    return NextResponse.json({ success: false, error: "Failed to update quantity" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart || !id) throw new Error("Invalid request");

    await prisma.cartItem.delete({
      where: { id, cartId: cart.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return NextResponse.json({ success: false, error: "Failed to remove item" }, { status: 500 });
  }
}