"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  initialIsWishlisted?: boolean
  className?: string
}

export function WishlistButton({
  productId,
  initialIsWishlisted = false,
  className,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(initialIsWishlisted)

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if inside a link
    // Optimistic UI update
    const prev = isWishlisted
    setIsWishlisted(!prev)
    
    try {
      const res = await fetch('/api/wishlist', {
        method: prev ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (!res.ok) {
        setIsWishlisted(prev)
      }
    } catch (error) {
      console.error(error)
      setIsWishlisted(prev)
    }
  }

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          isWishlisted
            ? "fill-danger-500 text-danger-500"
            : "text-neutral-500 hover:text-danger-500"
        )}
      />
    </button>
  )
}
