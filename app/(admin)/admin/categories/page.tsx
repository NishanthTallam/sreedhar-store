import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900">Categories</h1>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-200 bg-white">
        <table className="w-full text-left text-sm text-surface-600">
          <thead className="bg-surface-50 text-xs uppercase text-surface-500">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Products</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-surface-50">
                <td className="px-6 py-4">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 text-surface-400">
                      -
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-surface-900">{category.name}</td>
                <td className="px-6 py-4">{category._count.products}</td>
                <td className="px-6 py-4 text-right">
                  <button className="font-medium text-brand-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-surface-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}