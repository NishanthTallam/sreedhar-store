"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { RatingStars } from "@/components/ui/RatingStars"
import { WishlistButton } from "./WishlistButton"
import { useCart } from "@/components/providers/CartProvider"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  brandName?: string
  imageUrl: string
  startingPrice: number
  avgRating?: number
  stockStatus: "in-stock" | "low-stock" | "out-of-stock"
  isWishlisted?: boolean
  variantId?: string
}

export function ProductCard({
  id,
  name,
  slug,
  brandName,
  imageUrl,
  startingPrice,
  avgRating,
  stockStatus,
  isWishlisted = false,
  variantId,
}: ProductCardProps) {
  const { refreshCart } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variantId) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: 1 }),
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-lg border border-neutral-200 bg-white p-3 shadow-card transition-shadow hover:shadow-elevated sm:p-4">
      {/* Top right badges / wishlist */}
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
        <WishlistButton productId={id} initialIsWishlisted={isWishlisted} />
        {stockStatus !== "in-stock" && (
          <Badge
            variant="stock"
            statusColor={stockStatus === "low-stock" ? "warning" : "danger"}
          >
            {stockStatus === "low-stock" ? "Low Stock" : "Out of Stock"}
          </Badge>
        )}
      </div>

      <Link href={`/products/${slug}`} className="flex-1">
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        {brandName && (
          <p className="mb-1 text-xs font-medium text-neutral-500">{brandName}</p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 sm:text-base">
          {name}
        </h3>
        
        {avgRating !== undefined && avgRating > 0 && (
          <div className="mt-1 flex items-center">
            <RatingStars rating={avgRating} size="sm" />
            <span className="ml-1 text-xs text-neutral-500">{avgRating.toFixed(1)}</span>
          </div>
        )}
        
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xs text-neutral-500">From</span>
          <span className="text-lg font-bold text-neutral-900">₹{startingPrice}</span>
        </div>
      </Link>

      <div className="mt-4 pt-3 border-t border-neutral-100">
        {stockStatus !== "out-of-stock" ? (
          <Button className="w-full gap-2 sm:hidden" size="sm" onClick={handleAddToCart} disabled={isAdding}>
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? "Adding..." : "Add"}
          </Button>
        ) : (
          <Button className="w-full sm:hidden" size="sm" variant="secondary" disabled>
            Out of Stock
          </Button>
        )}
        
        {/* Desktop inline Add button */}
        {stockStatus !== "out-of-stock" ? (
          <Button className="hidden w-full gap-2 sm:flex" size="md" onClick={handleAddToCart} disabled={isAdding}>
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        ) : (
          <Button className="hidden w-full sm:flex" size="md" variant="secondary" disabled>
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  )
}
