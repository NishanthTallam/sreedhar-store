import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

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

  return (
    <div className="space-y-16 py-8">
      {/* Hero / Banners Placeholder */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="aspect-[21/9] w-full rounded-2xl bg-surface-200 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-600/10"></div>
          <div className="text-center z-10 p-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-surface-900 mb-4">
              Fresh Groceries, Delivered <span className="text-brand-600">Fast</span>
            </h1>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto mb-8">
              Order your daily essentials online. Enjoy cash on delivery and fast local service.
            </p>
            <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-8 text-base font-medium text-white transition-colors hover:bg-brand-700">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-surface-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="group flex flex-col items-center gap-3">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-brand-50 transition-transform group-hover:scale-105">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <span className="text-sm font-medium text-surface-900 text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-surface-900">Featured Products</h2>
          <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}