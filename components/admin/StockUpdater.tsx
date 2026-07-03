"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/app/(admin)/admin/actions";

export function StockUpdater({ variantId, initialStock }: { variantId: string, initialStock: number }) {
  const [stock, setStock] = useState(initialStock);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (stock !== initialStock) {
      startTransition(async () => {
        await updateStock(variantId, stock);
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
        onBlur={handleUpdate}
        className="w-20 rounded-md border border-neutral-300 p-1.5 text-sm"
        disabled={isPending}
      />
      {isPending && <span className="text-xs text-neutral-500">Saving...</span>}
    </div>
  );
}
