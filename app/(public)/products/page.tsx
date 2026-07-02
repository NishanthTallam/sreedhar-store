import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";

  const where = q
    ? {
        isActive: true,
        name: { contains: q, mode: "insensitive" as const },
      }
    : { isActive: true };

  const products = await prisma.product.findMany({
    where,
    include: { variants: true, brand: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">All Products</h1>
        {q && (
          <p className="mt-2 text-surface-500">Search results for "{q}"</p>
        )}
      </div>

      {/* Basic Search Bar */}
      <form className="mb-8 flex max-w-md gap-2" action="/products" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products..."
          className="flex-1 rounded-lg border border-surface-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button type="submit" className="rounded-lg bg-surface-900 px-4 py-2 font-medium text-white hover:bg-surface-800">
          Search
        </button>
      </form>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-surface-200 bg-surface-50">
          <p className="text-surface-500">No products found.</p>
        </div>
      )}
    </div>
  );
}