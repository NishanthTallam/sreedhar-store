import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add Brand
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Logo</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Products</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} className="h-10 w-10 rounded-lg object-contain" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                      -
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-neutral-900">{brand.name}</td>
                <td className="px-6 py-4">{brand._count.products}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/brands/${brand.id}/edit`}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                  No brands found. Click &ldquo;Add Brand&rdquo; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}