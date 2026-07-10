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

    // Fetch user and addresses in parallel
    const [user, addresses] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          phone: true,
        },
      }),
      prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { isDefault: "desc" },
      }),
    ]);

    return NextResponse.json({ success: true, data: { user, addresses } });
  } catch (error) {
    console.error("[CHECKOUT_INIT]", error);
    return NextResponse.json({ success: false, error: "Failed to initialize checkout" }, { status: 500 });
  }
}
