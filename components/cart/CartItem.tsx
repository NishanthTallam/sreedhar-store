"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { QuantityStepper } from "@/components/ui/QuantityStepper"

interface CartItemProps {
  id: string
  name: string
  variantLabel: string
  price: number
  imageUrl: string
  quantity: number
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

export function CartItem({
  id,
  name,
  variantLabel,
  price,
  imageUrl,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200 last:border-0">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 relative">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div>
            <h4 className="text-sm font-medium text-neutral-900 line-clamp-2">{name}</h4>
            <p className="mt-1 text-xs text-neutral-500">{variantLabel}</p>
          </div>
          <p className="text-sm font-bold text-neutral-900 whitespace-nowrap">₹{price * quantity}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <QuantityStepper
            value={quantity}
            onChange={(val) => onUpdateQuantity(id, val)}
            max={10} // Assuming arbitrary max per item for UI
          />
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="text-neutral-400 hover:text-danger-500 transition-colors p-2 -mr-2"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
