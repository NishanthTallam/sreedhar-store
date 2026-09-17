"use client";

import { Heart, Search, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useStore } from "@/store/useStore";

/* ── Single Wishlist Card ─────────────────────────────────────────── */
function WishlistCard({
  item,
  index,
  onRemove,
  onAddToCart,
  isAdding,
}: {
  item: any;
  index: number;
  onRemove: (product: any) => void;
  onAddToCart: (variantId: string, product: any) => void;
  isAdding: boolean;
}) {
  const product = item.product;
  const hasStock = product.variants?.some((v: any) => v.stock > 0);
  const variantId = product.variants?.[0]?.id;
  const price = product.variants?.[0]?.price ? Number(product.variants[0].price) : 0;

  const handleRemoveClick = () => {
    onRemove(product);
  };

  const handleAddToCartClick = () => {
    if (!variantId) return;
    onAddToCart(variantId, product);
  };

  return (
    <div className="group relative flex flex-col overflow-visible">
      <div className="relative flex flex-col overflow-hidden rounded-xl border border-neutral-200/70 bg-white/95 backdrop-blur-sm shadow-[0_4px_18px_rgba(15,23,42,0.07)]">
        {/* Image area */}
        <div className="relative aspect-square bg-neutral-100 flex items-center justify-center p-4 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="text-4xl text-neutral-400">📦</div>
          )}

          {/* Heart button */}
          <div className="absolute right-2 top-2 z-10">
            <div className="relative">
              <button
                onClick={handleRemoveClick}
                className="rounded-full p-1.5 bg-white/80 backdrop-blur-sm shadow-sm text-pink-500 hover:bg-white transition-colors"
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1 text-xs text-neutral-500">{product.brand?.name || "Generic"}</div>
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-neutral-900">
            <Link prefetch={false} href={`/products/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <div className="mt-auto flex items-end justify-between pt-2">
            <div>
              <div className="text-base font-semibold text-neutral-900">₹{price}</div>
            </div>
            {hasStock ? (
              <button
                onClick={handleAddToCartClick}
                disabled={!variantId || isAdding}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-50 shadow-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Add to cart</span>
              </button>
            ) : (
              <span className="text-xs font-medium text-danger-500">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Exported Component ──────────────────────────────────────── */
export function WishlistClientList({ initialItems }: { initialItems: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { moveFromWishlist, isAdding } = useCart();
  const { toggleWishlist } = useWishlist();
  const { wishlistData, setWishlistData } = useStore();

  const [storeInitialized, setStoreInitialized] = useState(false);

  useEffect(() => {
    if (initialItems && !storeInitialized) {
      setWishlistData(initialItems);
      setStoreInitialized(true);
    }
  }, [initialItems, setWishlistData, storeInitialized]);

  // After store is initialized, always use store data (even if empty) so optimistic updates work
  const items = storeInitialized ? wishlistData : initialItems;

  const filteredItems = items.filter(
    (item) =>
      item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product?.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (product: any) => {
    toggleWishlist({ product, isWishlisted: true });
  };

  const handleAddToCart = (variantId: string, product: any) => {
    if (!variantId) return;
    moveFromWishlist({
      variantId,
      productId: product.id,
      variant: { id: variantId, productId: product.id, product },
      product,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">My Wishlist</h1>
          <p className="mt-1 text-sm text-neutral-500">Save your favorite items for later.</p>
        </div>

        {/* Search with glow on focus */}
        <div className="relative max-w-sm w-full focus-within:ring-2 focus-within:ring-brand-500/30 rounded-lg transition-shadow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white/90 backdrop-blur-sm"
            placeholder="Search wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 border border-neutral-200/60 rounded-xl bg-white/80 backdrop-blur-sm">
          Your wishlist is empty.
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          No items found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, i) => (
            <WishlistCard
              key={item.id}
              item={item}
              index={i}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
              isAdding={isAdding}
            />
          ))}
        </div>
      )}
    </div>
  );
}
