import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900">Products</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-200 bg-white">
        <table className="w-full text-left text-sm text-surface-600">
          <thead className="bg-surface-50 text-xs uppercase text-surface-500">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category / Brand</th>
              <th className="px-6 py-4 font-medium">Variants (Stock)</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {products.map((product) => {
              const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
              
              return (
                <tr key={product.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-surface-100" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-surface-100 border border-surface-200"></div>
                      )}
                      <div>
                        <p className="font-medium text-surface-900">{product.name}</p>
                        <p className="text-xs text-surface-500 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-surface-900">{product.category.name}</p>
                    <p className="text-xs text-surface-500">{product.brand?.name || "No Brand"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-surface-900">{product.variants.length} variant(s)</p>
                    <p className={`text-xs font-medium ${totalStock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {totalStock} in stock
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {product.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/products/${product.id}/edit`} className="font-medium text-brand-600 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-surface-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}