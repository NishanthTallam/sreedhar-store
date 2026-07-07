import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { mrpPrice, discount } = body;

    const mrp = parseFloat(mrpPrice) || 0;
    const disc = parseFloat(discount) || 0;

    // Backend calculation logic for Selling Price
    // Assuming discount is a flat amount in ₹
    const price = Math.max(0, mrp - disc);

    return NextResponse.json({ success: true, price });
  } catch (error) {
    console.error("[CALCULATE_PRICE_POST]", error);
    return NextResponse.json({ success: false, error: "Failed to calculate price" }, { status: 500 });
  }
}
