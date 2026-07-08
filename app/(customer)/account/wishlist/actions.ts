"use server";

import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeWishlistItem(productId: string) {
  try {
    const session = await requireAuth();

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        }
      }
    });

    revalidatePath("/account/wishlist");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove wishlist item", error);
    return { success: false, error: "Failed to remove item" };
  }
}
