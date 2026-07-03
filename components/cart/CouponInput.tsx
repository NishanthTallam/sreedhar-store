"use client"

import * as React from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface CouponInputProps {
  onApply: (code: string) => Promise<void>
  appliedCoupon?: {
    code: string
    discountAmount: number
  } | null
  onRemove?: () => void
}

export function CouponInput({ onApply, appliedCoupon, onRemove }: CouponInputProps) {
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    setError("")
    
    try {
      await onApply(code.trim().toUpperCase())
      setCode("")
    } catch (err: any) {
      setError(err.message || "Invalid coupon code")
    } finally {
      setIsLoading(false)
    }
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-success-500 bg-success-500/10 p-3">
        <div className="flex items-center gap-2 text-success-500">
          <CheckCircle2 className="h-5 w-5" />
          <div className="text-sm">
            <span className="font-bold">{appliedCoupon.code}</span> applied
            <span className="ml-1 font-semibold block sm:inline">— ₹{appliedCoupon.discountAmount} off</span>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-sm font-medium text-danger-500 hover:text-danger-600 ml-4"
          >
            Remove
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleApply} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError("")
          }}
          className="uppercase placeholder:normal-case"
        />
        <Button 
          type="submit" 
          variant="secondary" 
          disabled={!code.trim() || isLoading}
          className="shrink-0"
        >
          {isLoading ? "Applying..." : "Apply"}
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-1 text-sm text-danger-500 mt-1">
          <XCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </form>
  )
}
