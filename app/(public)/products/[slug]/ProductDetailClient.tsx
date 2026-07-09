"use client";

import { useState } from "react";
import { Product, Variant, Brand, Category } from "@prisma/client";
import { VariantSelector } from "@/components/product/VariantSelector";
import { useCart } from "@/hooks/useCart";
import { useStore } from "@/store/useStore";
import { ShoppingCart } from "lucide-react";

type ProductWithRelations = Product & {
  variants: Variant[];
  brand: Brand | null;
  category: Category;
};

export default function ProductDetailClient({ product }: { product: ProductWithRelations }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0] || null);
  
  const { addToCart, isAdding } = useCart();
  const { cartData } = useStore();

  const isInCart = selectedVariant ? cartData?.items?.some((item: any) => item.variantId === selectedVariant.id) : false;

  const handleAddToCart = () => {
    if (!selectedVariant || isInCart) return;

    addToCart({ 
      variantId: selectedVariant.id, 
      quantity: 1, 
      variant: { 
        id: selectedVariant.id, 
        productId: product.id, 
        price: selectedVariant.price, 
        mrpPrice: selectedVariant.mrpPrice,
        product: { id: product.id, name: product.name, images: product.images } 
      } 
    });
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
        
        {/* Title */}
        <div className="mb-6 border-b border-neutral-200">
          <h1 className="inline-block border-b-4 border-neutral-800 pb-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {product.name}
          </h1>
        </div>

        {/* Selected Variant Price Info */}
        {selectedVariant && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-5xl font-bold tracking-tight text-neutral-900">₹{selectedVariant.price.toString()}</span>
              {selectedVariant.mrpPrice && (
                <div className="flex flex-col pb-1">
                  <span className="text-lg text-neutral-500 line-through decoration-1">₹{selectedVariant.mrpPrice.toString()}</span>
                  {selectedVariant.discount && (
                    <span className="inline-block rounded bg-[#c82020] px-1.5 py-0.5 text-[11px] font-bold text-white tracking-wider w-fit">
                      {selectedVariant.discount.toString()}% OFF
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-neutral-900">{selectedVariant.label} {selectedVariant.unit}</span>
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stock === 0 || isAdding || isInCart}
                className="inline-flex gap-2 items-center rounded-lg bg-[#16a34a] px-8 py-2.5 text-base font-bold text-white hover:bg-[#15803d] disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {selectedVariant.stock === 0 ? "Out of Stock" : isInCart ? "In Cart" : isAdding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        )}

        {/* Variants Selection Grid */}
        {product.variants.length > 0 && selectedVariant && (
          <div className="mb-8 pt-4">
            <VariantSelector 
              variants={product.variants} 
              selectedId={selectedVariant.id} 
              onSelect={(id) => setSelectedVariant(product.variants.find(v => v.id === id) as Variant)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
