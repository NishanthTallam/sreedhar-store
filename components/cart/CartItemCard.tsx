"use client";

import { Heart } from "lucide-react";
import Image from "next/image";

interface CartItemCardProps {
  item: any; // In a real app, define a proper type
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist?: (id: string, productId: string) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove, onMoveToWishlist }: CartItemCardProps) {
  return (
    <div className="flex gap-4 border-b border-neutral-200 py-4 last:border-0">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 relative">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="96px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium text-neutral-900 line-clamp-2 pr-4">{item.productName}</h4>
            <p className="mt-1 text-xs text-neutral-500">{item.variantLabel}</p>
          </div>
          <p className="text-sm font-semibold text-neutral-900 whitespace-nowrap">₹{item.price}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center rounded-lg border border-neutral-200 bg-white shadow-sm">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-50"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100"
            >
              +
            </button>
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            {onMoveToWishlist && item.productId && (
              <button
                onClick={() => onMoveToWishlist(item.id, item.productId)}
                className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-brand-600 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Move to Wishlist</span>
              </button>
            )}
            <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
