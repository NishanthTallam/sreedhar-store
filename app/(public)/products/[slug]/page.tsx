import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VariantSelector } from "@/components/product/VariantSelector";
import Link from "next/link";

// Using a Client Component wrapper to handle the VariantSelector state 
// and Add to Cart logic, since this page is a Server Component.
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      variants: true,
      brand: true,
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Convert Decimal fields to numbers for the Client Component
  const formattedProduct = {
    ...product,
    avgRating: product.avgRating ? Number(product.avgRating) : null,
    variants: product.variants.map(v => ({
      ...v,
      price: Number(v.price),
      mrpPrice: v.mrpPrice ? Number(v.mrpPrice) : null,
      discount: v.discount ? Number(v.discount) : null,
    }))
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex text-sm text-neutral-500">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
          <li>/</li>
          <li><Link href={`/category/${product.category.slug}`} className="hover:text-brand-600">{product.category.name}</Link></li>
          <li>/</li>
          <li className="font-medium text-neutral-900">{product.name}</li>
        </ol>
      </nav>

      {/* Since we need interactivity for VariantSelector, we offload to a client component */}
      <ProductDetailClient product={formattedProduct as any} />
      
      {/* Description / details */}
      <div className="mt-16 border-t border-neutral-200 pt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Product Details</h2>
        <div className="prose prose-neutral max-w-none">
          <p>{product.description || "No description available."}</p>
        </div>
      </div>
    </div>
  );
}