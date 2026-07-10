import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
    select: { id: true, name: true, slug: true },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      avgRating: true,
      variants: {
        select: {
          id: true,
          price: true,
          stock: true,
          lowStockAt: true,
        },
      },
      brand: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{category.name}</h1>
        <p className="mt-2 text-neutral-500">{products.length} products found</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => {
            const lowestPrice = product.variants.length > 0
              ? Math.min(...product.variants.map((v) => Number(v.price)))
              : 0;
            const hasStock = product.variants.some((v) => v.stock > 0);
            const isLowStock = product.variants.some((v) => v.stock > 0 && v.stock <= v.lowStockAt);

            return (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={product.name} 
                slug={product.slug} 
                brandName={product.brand?.name} 
                imageUrl={product.images[0] || ""} 
                startingPrice={lowestPrice} 
                avgRating={product.avgRating ? Number(product.avgRating) : undefined}
                stockStatus={!hasStock ? "out-of-stock" : isLowStock ? "low-stock" : "in-stock"} 
                variantId={product.variants?.[0]?.id}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50">
          <p className="text-neutral-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}