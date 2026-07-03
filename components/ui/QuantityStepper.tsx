"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  disabled?: boolean
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  disabled = false,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center rounded-md border border-neutral-300 bg-white",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min || disabled}
        className="flex h-full w-8 items-center justify-center text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50"
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </button>
      <div className="flex h-full w-8 items-center justify-center border-x border-neutral-300 text-sm font-medium text-neutral-900">
        {value}
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max || disabled}
        className="flex h-full w-8 items-center justify-center text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </button>
    </div>
  )
}
