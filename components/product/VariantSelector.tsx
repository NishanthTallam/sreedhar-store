"use client";

import { Variant } from "@prisma/client";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant;
  onSelect: (variant: Variant) => void;
}

export default function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant.id === variant.id;
          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={`flex flex-col items-center justify-center rounded-xl border px-4 py-2 transition-all ${
                isSelected
                  ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500"
                  : "border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:bg-surface-50"
              }`}
            >
              <span className="text-sm font-semibold">{variant.label}</span>
              <span className="text-xs opacity-80">₹{Number(variant.price)}</span>
            </button>
          );
        })}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-surface-900">
          ₹{Number(selectedVariant.price)}
        </span>
        {selectedVariant.stock > 0 ? (
          <span className="text-sm font-medium text-brand-600">In Stock</span>
        ) : (
          <span className="text-sm font-medium text-red-600">Out of Stock</span>
        )}
      </div>
    </div>
  );
}
