import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bannerSchema } from "@/lib/validators/banner";
import { requireAdmin } from "@/lib/rbac";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";
    
    let isAdmin = false;
    if (adminMode) {
      const session = await auth.api.getSession({ headers: await headers() });
      if ((session?.user as any)?.role === "ADMIN") {
        isAdmin = true;
      }
    }

    const where: any = {};
    if (!isAdmin) {
      where.isActive = true;
      const now = new Date();
      where.OR = [
        { startsAt: null, endsAt: null },
        { startsAt: { lte: now }, endsAt: { gte: now } },
        { startsAt: { lte: now }, endsAt: null },
        { startsAt: null, endsAt: { gte: now } }
      ];
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error("[BANNERS_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = bannerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const banner = await prisma.banner.create({
      data: {
        type: data.type,
        title: data.title,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        isActive: data.isActive,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      }
    });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    console.error("[BANNERS_POST]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or server error" }, { status: 401 });
  }
}