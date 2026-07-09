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

    const { productId } = await req.json();

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } }
    });

    if (!existing) {
      await prisma.wishlistItem.create({
        data: { userId: session.user.id, productId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return NextResponse.json({ success: false, error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id, productId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return NextResponse.json({ success: false, error: "Failed to remove from wishlist" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: { 
        product: {
          include: {
            variants: true,
            brand: true
          }
        } 
      }
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist" }, { status: 500 });
  }
}