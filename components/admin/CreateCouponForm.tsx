"use client";

import { useState, useTransition } from "react";
import { createCoupon, CouponInput } from "@/app/(admin)/admin/actions";

export function CreateCouponForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const data: CouponInput = {
      code: (formData.get("code") as string).trim(),
      type: formData.get("type") as "PERCENTAGE" | "FLAT",
      value: parseFloat(formData.get("value") as string),
      minOrderValue: formData.get("minOrderValue") ? parseFloat(formData.get("minOrderValue") as string) : undefined,
      maxDiscount: formData.get("maxDiscount") ? parseFloat(formData.get("maxDiscount") as string) : undefined,
      usageLimit: formData.get("usageLimit") ? parseInt(formData.get("usageLimit") as string) : undefined,
    };

    if (!data.code || isNaN(data.value)) {
      setError("Code and Value are required");
      return;
    }

    startTransition(async () => {
      try {
        await createCoupon(data);
        setIsOpen(false);
      } catch (err: any) {
        setError("Failed to create coupon. Code might already exist.");
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Create New Coupon
      </button>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-neutral-900">Create New Coupon</h2>
        <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-600">&times;</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Code (e.g. SUMMER25) *</label>
            <input required name="code" className="w-full rounded-md border border-neutral-300 p-2 text-sm uppercase" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Type *</label>
            <select name="type" className="w-full rounded-md border border-neutral-300 p-2 text-sm bg-white">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FLAT">Flat Amount (₹)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Discount Value *</label>
            <input required type="number" step="0.01" min="0" name="value" className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Min Order Value (₹)</label>
            <input type="number" step="0.01" min="0" name="minOrderValue" className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Max Discount Amount (₹)</label>
            <input type="number" step="0.01" min="0" name="maxDiscount" className="w-full rounded-md border border-neutral-300 p-2 text-sm" placeholder="For percentage coupons" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Usage Limit</label>
            <input type="number" min="1" name="usageLimit" className="w-full rounded-md border border-neutral-300 p-2 text-sm" placeholder="Total times can be used" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50">
            Cancel
          </button>
          <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:bg-brand-400">
            {isPending ? "Saving..." : "Save Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}
