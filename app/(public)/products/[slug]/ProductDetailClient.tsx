"use client";

import { useState } from "react";
import { Product, Variant, Brand, Category } from "@prisma/client";
import { VariantSelector } from "@/components/product/VariantSelector";

type ProductWithRelations = Product & {
  variants: Variant[];
  brand: Brand | null;
  category: Category;
};

export default function ProductDetailClient({ product }: { product: ProductWithRelations }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0] || null);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    // In Phase 2, this will call the cart API.
    alert(`Added ${product.name} (${selectedVariant.label}) to cart!`);
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* Image Gallery */}
      <div className="aspect-square w-full overflow-hidden rounded-3xl bg-neutral-50 border border-neutral-200">
        {product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">No Image</div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">{product.brand?.name || "Generic"}</span>
          {product.isReturnable && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Returnable
            </span>
          )}
        </div>
        
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          {product.name}
        </h1>

        {product.variants.length > 0 && selectedVariant && (
          <div className="mb-8 border-t border-b border-neutral-200 py-6">
            <h3 className="mb-4 text-sm font-medium text-neutral-900">Select Variant</h3>
            <VariantSelector 
              variants={product.variants} 
              selectedId={selectedVariant.id} 
              onSelect={(id) => setSelectedVariant(product.variants.find(v => v.id === id) as Variant)} 
            />
          </div>
        )}

        <div className="mt-auto flex gap-4 pt-8">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="flex flex-1 items-center justify-center rounded-xl bg-brand-600 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          
          <button className="flex items-center justify-center rounded-xl border border-neutral-300 bg-white p-4 text-neutral-500 hover:bg-neutral-50 hover:text-brand-600 transition-colors">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
