import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/rbac";
import { NotificationCategory } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const category = searchParams.get("category") as NotificationCategory | null;

    const where: any = { userId };
    if (unreadOnly) where.isRead = false;
    if (category) where.category = category;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or server error" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    
    // Simplistic validation for manual broadcasting
    if (!body.title || !body.body || !body.category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    let userIds = body.userIds || [];
    
    // If no specific users selected, broadcast to all customers
    if (userIds.length === 0) {
      const customers = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        select: { id: true },
      });
      userIds = customers.map(c => c.id);
      
      // Also send a copy to the admin who initiated it so they can see the broadcast
      const session = await requireAuth();
      if (!userIds.includes(session.user.id)) {
        userIds.push(session.user.id);
      }
    }

    // Bulk insert
    const dataToInsert = userIds.map((uid: string) => ({
      userId: uid,
      title: body.title,
      body: body.body,
      category: body.category,
    }));

    if (dataToInsert.length > 0) {
      await prisma.notification.createMany({
        data: dataToInsert,
      });
    }

    return NextResponse.json({ success: true, message: `Sent to ${dataToInsert.length} users` }, { status: 201 });
  } catch (error) {
    console.error("[NOTIFICATIONS_POST]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or failed to send" }, { status: 500 });
  }
}