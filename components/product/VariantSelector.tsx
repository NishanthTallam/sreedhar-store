"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Variant {
  id: string
  label: string
  unit: string
  price: any
  stock: number
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedId: string
  onSelect: (id: string) => void
  className?: string
}

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {variants.map((variant) => {
        const isSelected = selectedId === variant.id
        const isOutOfStock = variant.stock <= 0

        return (
          <button
            key={variant.id}
            type="button"
            disabled={isOutOfStock}
            onClick={() => onSelect(variant.id)}
            className={cn(
              "flex flex-col items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500",
              isSelected
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-brand-200",
              isOutOfStock &&
                "cursor-not-allowed opacity-50 grayscale"
            )}
          >
            <span className={cn(isOutOfStock && "line-through")}>
              {variant.label} {variant.unit}
            </span>
            <span className="mt-1 text-xs font-semibold">
              ₹{variant.price}
            </span>
          </button>
        )
      })}
    </div>
  )
}
