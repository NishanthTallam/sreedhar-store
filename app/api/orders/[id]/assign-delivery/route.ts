import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const assignDeliverySchema = z.object({
  deliveryBoyId: z.string().min(1),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const deliveryBoyId = formData.get("deliveryBoyId") as string;

    const parsed = assignDeliverySchema.safeParse({ deliveryBoyId });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid delivery boy ID" }, { status: 400 });
    }

    // Ensure user is actually a delivery boy
    const deliveryBoy = await prisma.user.findUnique({
      where: { id: deliveryBoyId, role: "DELIVERY_BOY" }
    });

    if (!deliveryBoy) {
      return NextResponse.json({ error: "User not found or is not a delivery boy" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: (await context.params).id },
      select: { id: true, status: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: (await context.params).id },
      data: { deliveryBoyId }
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "DELIVERY_BOY_ASSIGNED",
      entityType: "Order",
      entityId: order.id,
      metadata: { deliveryBoyId },
    });

    return NextResponse.redirect(new URL(`/admin/orders/${order.id}`, request.url));
  } catch (error) {
    console.error("[AssignDelivery] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}