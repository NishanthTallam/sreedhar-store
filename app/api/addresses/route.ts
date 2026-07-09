import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, mobile, houseNo, street, landmark, city, state, pincode, type, latitude, longitude } = body;

    // Remove default from all other addresses if this one is set to default, or if it's the first one
    const existingAddresses = await prisma.address.count({ where: { userId: session.user.id } });
    const isDefault = existingAddresses === 0; // Make default if it's the first address

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        mobile,
        houseNo: houseNo || "",
        street,
        landmark,
        city,
        state,
        pincode,
        type: type || "HOME",
        latitude,
        longitude,
        isDefault
      }
    });

    return NextResponse.json({ success: true, data: address }, { status: 201 });
  } catch (error: any) {
    console.error("[ADDRESS_POST]", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create address" }, { status: 500 });
  }
}
