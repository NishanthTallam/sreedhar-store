import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { validateCoupon } from "@/lib/coupons";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { variant: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // Removing coupon if code is empty
    if (!code) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { couponId: null }
      });
      return NextResponse.json({ success: true, message: "Coupon removed" });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) {
      return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 400 });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.variant.price) * item.quantity), 0);
    
    const validation = validateCoupon(coupon, subtotal);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.reason }, { status: 400 });
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: coupon.id }
    });

    return NextResponse.json({ success: true, message: "Coupon applied successfully!" });
  } catch (error) {
    console.error("[COUPONS_APPLY]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}