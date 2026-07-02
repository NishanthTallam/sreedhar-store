import { Coupon } from "@prisma/client";

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (!coupon.isActive) return 0;
  
  if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
    return 0; // Does not meet minimum requirement
  }

  let discount = 0;
  if (coupon.type === "FLAT") {
    discount = Number(coupon.value);
  } else if (coupon.type === "PERCENTAGE") {
    discount = subtotal * (Number(coupon.value) / 100);
    if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
      discount = Number(coupon.maxDiscount);
    }
  }

  // Discount shouldn't exceed subtotal
  return Math.min(discount, subtotal);
}

export function validateCoupon(coupon: Coupon, subtotal: number): { valid: boolean; reason?: string } {
  if (!coupon.isActive) {
    return { valid: false, reason: "Coupon is not active." };
  }
  
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, reason: "Coupon has expired." };
  }
  
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: "Coupon usage limit reached." };
  }
  
  if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
    return { valid: false, reason: `Minimum order value of ₹${coupon.minOrderValue} required.` };
  }
  
  return { valid: true };
}
