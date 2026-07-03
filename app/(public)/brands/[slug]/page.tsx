import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { notFound } from "next/navigation";

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const brand = await prisma.brand.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!brand) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { brandId: brand.id, isActive: true },
    include: { variants: true, brand: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        {brand.logoUrl && (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
            <img src={brand.logoUrl} alt={brand.name} className="h-full w-full object-contain" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{brand.name}</h1>
          <p className="mt-1 text-neutral-500">{products.length} products found</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id} 
              name={product.name} 
              slug={product.slug} 
              brandName={product.brand?.name} 
              imageUrl={product.images[0] || ""} 
              startingPrice={Number(product.variants?.[0]?.price) || 0} 
              stockStatus={product.variants?.[0]?.stock > 0 ? "in-stock" : "out-of-stock"} 
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50">
          <p className="text-neutral-500">No products found for this brand.</p>
        </div>
      )}
    </div>
  );
}