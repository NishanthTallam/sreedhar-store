"use server";

import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAddress(id: string) {
  try {
    const session = await requireAuth();
    
    // Ensure the address belongs to the user
    await prisma.address.delete({
      where: {
        id,
        userId: session.user.id
      }
    });
    
    revalidatePath("/account/address");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete address", error);
    return { success: false, error: "Failed to delete address" };
  }
}

export async function addAddress(formData: FormData) {
  try {
    const session = await requireAuth();

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName: formData.get("fullName") as string,
        mobile: formData.get("mobile") as string,
        houseNo: formData.get("houseNo") as string,
        street: formData.get("street") as string,
        landmark: (formData.get("landmark") as string) || null,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: formData.get("pincode") as string,
        type: (formData.get("type") as "HOME" | "WORK" | "OTHER") || "HOME",
      }
    });

    revalidatePath("/account/address");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add address", error);
    return { success: false, error: "Failed to add address" };
  }
}

export async function updateAddress(formData: FormData) {
  try {
    const session = await requireAuth();
    const id = formData.get("id") as string;

    await prisma.address.update({
      where: {
        id,
        userId: session.user.id
      },
      data: {
        fullName: formData.get("fullName") as string,
        mobile: formData.get("mobile") as string,
        houseNo: formData.get("houseNo") as string,
        street: formData.get("street") as string,
        landmark: (formData.get("landmark") as string) || null,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: formData.get("pincode") as string,
        type: (formData.get("type") as "HOME" | "WORK" | "OTHER") || "HOME",
      }
    });

    revalidatePath("/account/address");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update address", error);
    return { success: false, error: "Failed to update address" };
  }
}
