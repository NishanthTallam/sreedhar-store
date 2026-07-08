import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { BannerCarousel } from "@/components/layout/BannerCarousel";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    take: 8,
    orderBy: { products: { _count: "desc" } }
  });

  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: true,
      brand: true,
    },
    take: 8,
    orderBy: { createdAt: "desc" }
  });

  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  // Map to the format BannerCarousel expects
  const formattedBanners = banners.map(b => ({
    id: b.id,
    imageUrl: b.imageUrl,
    title: b.title,
    linkUrl: b.linkUrl || undefined,
  }));

  return (
    <>
      <div className="space-y-16 py-8">
        {/* Banner Carousel */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BannerCarousel banners={formattedBanners} />
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="group flex flex-col items-center gap-3">
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-brand-50 border border-brand-100 transition-transform group-hover:scale-105 shadow-sm">
                  {category.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <span className="text-sm font-medium text-neutral-900 text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 md:pb-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Featured Products</h2>
            <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {featuredProducts.map((product) => {
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
              )
            })}
          </div>
        </section>
      </div>
    </>
  );
}