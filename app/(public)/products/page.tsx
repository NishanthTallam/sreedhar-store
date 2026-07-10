import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, brand?: string, minPrice?: string, maxPrice?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";
  const brandParam = resolvedSearchParams.brand || "";
  const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;

  const where: any = { isActive: true };
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }
  if (brandParam) {
    where.brand = { slug: brandParam };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.variants = {
      some: {
        price: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        }
      }
    };
  }

  // Fetch products and brands in parallel
  const [products, allBrands] = await Promise.all([
    prisma.product.findMany({
      where,
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
        brand: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.brand.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">All Products</h1>
        {q && (
          <p className="mt-2 text-neutral-500">Search results for "{q}"</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <form action="/products" method="GET" className="space-y-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            {q && <input type="hidden" name="q" value={q} />}
            
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Brand</h3>
              <select 
                name="brand" 
                defaultValue={brandParam}
                className="w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">All Brands</option>
                {allBrands.map(b => (
                  <option key={b.id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Price Range (₹)</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  name="minPrice" 
                  defaultValue={minPrice} 
                  placeholder="Min" 
                  min="0"
                  className="w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" 
                />
                <span className="text-neutral-500">-</span>
                <input 
                  type="number" 
                  name="maxPrice" 
                  defaultValue={maxPrice} 
                  placeholder="Max" 
                  min="0"
                  className="w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" 
                />
              </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Apply Filters
            </button>
            <Link href="/products" className="block text-center w-full text-sm font-medium text-brand-600 hover:text-brand-700 mt-2">
              Clear All
            </Link>
          </form>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
                  variantId={product.variants?.[0]?.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50">
              <p className="text-neutral-500">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}