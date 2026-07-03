"use client";

import { useState, useTransition } from "react";
import { toggleCouponStatus, deleteCoupon } from "@/app/(admin)/admin/actions";

export function CouponActions({ couponId, isActive }: { couponId: string, isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleCouponStatus(couponId, !isActive);
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      startTransition(async () => {
        await deleteCoupon(couponId);
      });
    }
  };

  return (
    <div className="flex justify-end gap-3 items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isActive} 
          onChange={handleToggle}
          disabled={isPending}
        />
        <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
      </label>
      
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:text-red-800 disabled:opacity-50"
        title="Delete Coupon"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
      </button>
    </div>
  );
}
