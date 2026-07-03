"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

// --- INVENTORY ---
export async function updateStock(variantId: string, newStock: number) {
  await requireAdmin();
  await prisma.variant.update({
    where: { id: variantId },
    data: { stock: newStock }
  });
  revalidatePath("/admin/inventory");
  return { success: true };
}

// --- RETURNS ---
export async function updateReturnStatus(returnId: string, status: "APPROVED" | "REJECTED" | "CLOSED", adminNote?: string) {
  await requireAdmin();
  await prisma.returnRequest.update({
    where: { id: returnId },
    data: { 
      status,
      adminNote,
      resolvedAt: new Date()
    }
  });
  revalidatePath("/admin/returns");
  return { success: true };
}

// --- COUPONS ---
export type CouponInput = {
  code: string;
  type: "PERCENTAGE" | "FLAT";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
};

export async function createCoupon(data: CouponInput) {
  await requireAdmin();
  await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value,
      minOrderValue: data.minOrderValue || null,
      maxDiscount: data.maxDiscount || null,
      usageLimit: data.usageLimit || null,
    }
  });
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponStatus(couponId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.coupon.update({
    where: { id: couponId },
    data: { isActive }
  });
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(couponId: string) {
  await requireAdmin();
  await prisma.coupon.delete({
    where: { id: couponId }
  });
  revalidatePath("/admin/coupons");
  return { success: true };
}

// --- CUSTOMERS ---
export async function toggleCustomerBlock(userId: string, isBlocked: boolean) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { isBlocked }
  });
  revalidatePath("/admin/customers");
  return { success: true };
}

export async function updateCustomerRole(userId: string, role: "CUSTOMER" | "ADMIN" | "DELIVERY_BOY") {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  });
  revalidatePath("/admin/customers");
  return { success: true };
}

// --- REVIEWS ---
export async function updateReviewStatus(reviewId: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { status }
  });
  revalidatePath("/admin/reviews");
  return { success: true };
}
