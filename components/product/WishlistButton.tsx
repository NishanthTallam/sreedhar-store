"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/hooks/useWishlist"
import { useStore } from "@/store/useStore"

interface WishlistButtonProps {
  productId: string
  initialIsWishlisted?: boolean
  className?: string
  product?: any // To pass to store for optimistic add
}

export function WishlistButton({
  productId,
  initialIsWishlisted = false,
  className,
  product = { id: productId },
}: WishlistButtonProps) {
  const { toggleWishlist, isToggling } = useWishlist()
  const { wishlistData } = useStore()

  // Use global state if available, fallback to initial
  const isWishlisted = wishlistData?.some((item) => item.productId === productId) ?? initialIsWishlisted

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist({ product, isWishlisted })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isToggling}
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
