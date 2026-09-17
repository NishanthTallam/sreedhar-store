import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Grid } from "lucide-react";

export const metadata = {
  title: "All Categories | Sreedhar Store",
  description: "Browse all product categories at Sreedhar General Store.",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          All Categories
        </h1>
        <p className="mt-2 text-neutral-500">
          Browse our full range of product categories.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50">
          <Grid className="h-12 w-12 text-neutral-300 mb-4" />
          <p className="text-neutral-500">No categories available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map((category) => (
            <Link prefetch={false}
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm transition-all hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Category Image */}
              <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <Grid className="h-8 w-8 text-neutral-400" />
                )}
              </div>

              {/* Category Name */}
              <p className="text-sm font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                {category.name}
              </p>

              {/* Product Count */}
              <p className="mt-1 text-xs text-neutral-400">
                {category._count.products}{" "}
                {category._count.products === 1 ? "product" : "products"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
