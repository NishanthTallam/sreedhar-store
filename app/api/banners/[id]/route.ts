import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import { bannerSchema } from "@/lib/validators/banner";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const parsed = bannerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const banner = await prisma.banner.update({
      where: { id },
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

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error("[BANNERS_PUT]", error);
    return NextResponse.json({ success: false, error: "Unauthorized or failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BANNERS_DELETE]", error);
    return NextResponse.json({ success: false, error: "Failed to delete banner" }, { status: 500 });
  }
}
