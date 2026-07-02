import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    await requireAdmin();
    // Assuming there is only one StoreSetting record
    let settings = await prisma.storeSetting.findFirst();
    
    // Create default if it doesn't exist
    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: "General Store",
          currency: "USD",
          language: "en",
        }
      });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    
    let settings = await prisma.storeSetting.findFirst();
    
    if (settings) {
      settings = await prisma.storeSetting.update({
        where: { id: settings.id },
        data: {
          storeName: body.storeName,
          storeAddress: body.storeAddress,
          supportPhone: body.supportPhone,
          supportEmail: body.supportEmail,
          whatsappNumber: body.whatsappNumber,
          currency: body.currency,
          language: body.language,
          deliveryChargeFlat: body.deliveryChargeFlat,
          freeDeliveryAbove: body.freeDeliveryAbove,
          smtpFromEmail: body.smtpFromEmail,
        },
      });
    } else {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: body.storeName || "General Store",
          storeAddress: body.storeAddress,
          supportPhone: body.supportPhone,
          supportEmail: body.supportEmail,
          whatsappNumber: body.whatsappNumber,
          currency: body.currency || "USD",
          language: body.language || "en",
          deliveryChargeFlat: body.deliveryChargeFlat,
          freeDeliveryAbove: body.freeDeliveryAbove,
          smtpFromEmail: body.smtpFromEmail,
        },
      });
    }

    // Write audit log
    await writeAuditLog({
      userId: session.user.id,
      action: "SETTINGS_UPDATED",
      entityType: "StoreSetting",
      entityId: settings.id,
      metadata: body,
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[SETTINGS_PUT]", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}