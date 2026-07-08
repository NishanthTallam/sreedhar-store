"use server";

import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePersonalDetails(formData: FormData) {
  try {
    const session = await requireAuth();
    
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    
    const name = `${firstName} ${lastName}`.trim();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name,
        phone: phone || null,
      },
    });

    revalidatePath("/account");
    return { success: true, message: "Profile updated successfully" };
  } catch (error: any) {
    console.error("Failed to update profile", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}
