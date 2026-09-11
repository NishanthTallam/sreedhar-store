"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { RatingStars } from "@/components/ui/RatingStars"
import { WishlistButton } from "./WishlistButton"
import { useCart } from "@/hooks/useCart"
import { useStore } from "@/store/useStore"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  brandName?: string
  imageUrl: string
  startingPrice: number
  /** Original / Maximum Retail Price. Show strikethrough + discount badge when > startingPrice. */
  mrp?: number
  avgRating?: number
  stockStatus: "in-stock" | "low-stock" | "out-of-stock"
  isWishlisted?: boolean
  variantId?: string
}

function ProductCardInner({
  id,
  name,
  slug,
  brandName,
  imageUrl,
  startingPrice,
  mrp,
  avgRating,
  stockStatus,
  isWishlisted = false,
  variantId,
}: ProductCardProps) {
  const { addToCart, isAdding } = useCart();
  const { cartData } = useStore();

  const isInCart = variantId
    ? cartData?.items?.some((item) => item.variantId === variantId)
    : false;

  // Compute discount % — only when mrp is strictly greater than selling price
  const hasDiscount =
    mrp !== undefined && mrp > startingPrice && startingPrice > 0;
  const discountPct = hasDiscount
    ? Math.round(((mrp! - startingPrice) / mrp!) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variantId || isInCart) return;

    addToCart({
      variantId,
      quantity: 1,
      variant: {
        id: variantId,
        productId: id,
        price: startingPrice,
        mrpPrice: mrp ?? startingPrice,
        product: { id, name, images: [imageUrl] },
      },
    });
  };

  return (
    <div className="group relative flex flex-col rounded-lg border border-neutral-200 bg-white p-3 shadow-card transition-shadow hover:shadow-elevated sm:p-4">
      {/* Top-right: wishlist + stock badge */}
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
        <WishlistButton
          productId={id}
          initialIsWishlisted={isWishlisted}
          product={{ id, name, images: [imageUrl] }}
        />
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
        {/* Product image with optional discount badge */}
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-neutral-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            loading="lazy"
          />
          {/* Discount badge — bottom-left corner of image */}
          {hasDiscount && discountPct > 0 && (
            <span className="absolute bottom-2 left-2 rounded-sm bg-green-500 px-1.5 py-0.5 text-[10px] font-bold leading-tight text-white shadow-sm">
              {discountPct}% OFF
            </span>
          )}
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
            <span className="ml-1 text-xs text-neutral-500">
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Pricing row */}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          {/* Selling / special price — always shown */}
          <span className="text-lg font-bold text-neutral-900">
            ₹{startingPrice.toLocaleString("en-IN")}
          </span>
          {/* MRP strikethrough — only when a real discount exists */}
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">
              ₹{mrp!.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </Link>

      <div className="mt-4 pt-3 border-t border-neutral-100">
        {/* Mobile add button */}
        {stockStatus !== "out-of-stock" ? (
          <Button
            className="w-full gap-2 sm:hidden"
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding || isInCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {isInCart ? "In Cart" : isAdding ? "Adding..." : "Add"}
          </Button>
        ) : (
          <Button className="w-full sm:hidden" size="sm" variant="secondary" disabled>
            Out of Stock
          </Button>
        )}

        {/* Desktop add button */}
        {stockStatus !== "out-of-stock" ? (
          <Button
            className="hidden w-full gap-2 sm:flex"
            size="md"
            onClick={handleAddToCart}
            disabled={isAdding || isInCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {isInCart ? "In Cart" : isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        ) : (
          <Button className="hidden w-full sm:flex" size="md" variant="secondary" disabled>
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
}

export const ProductCard = React.memo(ProductCardInner);
