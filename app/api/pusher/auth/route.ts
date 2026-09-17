import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getSessionUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.formData();
    const socketId = data.get("socket_id") as string;
    const channelName = data.get("channel_name") as string;

    if (!socketId || !channelName) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const role = (session.user as any).role;

    // Authorization logic
    if (channelName.startsWith("private-order-")) {
      const orderId = channelName.split("private-order-")[1];
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      
      if (!order || (role !== "ADMIN" && order.userId !== session.user.id)) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } else if (channelName.startsWith("private-user-")) {
      const userId = channelName.split("private-user-")[1];
      if (userId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } else if (channelName.startsWith("private-admin")) {
      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } else if (channelName.startsWith("private-delivery")) {
      if (role !== "DELIVERY_BOY" && role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("[Pusher Auth]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
