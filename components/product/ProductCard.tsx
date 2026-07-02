import Link from "next/link";
import { Product, Variant, Brand } from "@prisma/client";

interface ProductCardProps {
  product: Product & {
    variants: Variant[];
    brand: Brand | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Assuming first variant is the default/cheapest
  const startingPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => Number(v.price)))
    : 0;

  const imageUrl = product.images.length > 0 ? product.images[0] : "https://placehold.co/400x400?text=No+Image";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-surface-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {/* Wishlist Button (stub) */}
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-surface-400 backdrop-blur-sm transition-colors hover:text-brand-600"
          aria-label="Add to wishlist"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-surface-500">
          <span>{product.brand?.name || "Generic"}</span>
          {product.avgRating && (
            <span className="flex items-center gap-1 text-accent-500">
              <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {Number(product.avgRating).toFixed(1)}
            </span>
          )}
        </div>
        <h3 className="mb-2 text-sm font-medium leading-tight text-surface-900 line-clamp-2">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-xs text-surface-500">From </span>
            <span className="text-lg font-bold text-surface-900">₹{startingPrice}</span>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="flex h-8 items-center justify-center rounded-lg bg-brand-50 px-4 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
          >
            Add
          </Link>
        </div>
      </div>
    </div>
  );
}
