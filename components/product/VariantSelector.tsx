"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Variant {
  id: string
  label: string
  unit: string
  price: any
  mrpPrice?: any
  discount?: any
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
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
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
              "relative flex flex-col items-start justify-center rounded-lg border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#16a34a]/50",
              isSelected
                ? "border-[#a5d6a7] bg-[#f0f8ec]"
                : "border-neutral-200 bg-white hover:border-[#a5d6a7]",
              isOutOfStock && "cursor-not-allowed opacity-50 grayscale"
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className={cn("text-sm font-medium text-neutral-900", isOutOfStock && "line-through")}>
                {variant.label} {variant.unit}
              </span>
              {isSelected && (
                <svg className="h-4 w-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-neutral-900">₹{variant.price}</span>
              {variant.mrpPrice && (
                <span className="text-sm text-neutral-500 line-through">₹{variant.mrpPrice}</span>
              )}
              {variant.discount && (
                <span className="rounded bg-[#c82020] px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider">
                  {variant.discount}% OFF
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
