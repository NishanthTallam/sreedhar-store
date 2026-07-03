import { prisma } from "@/lib/prisma";
import { StockUpdater } from "@/components/admin/StockUpdater";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function AdminInventoryPage() {
  const variants = await prisma.variant.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true, images: true } }
    },
    orderBy: [
      { stock: 'asc' }, // Show low stock items first
      { product: { name: 'asc' } }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Inventory Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage stock levels across all product variants.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Variant</th>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium w-48">Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {variant.product.images[0] ? (
                      <img src={variant.product.images[0]} alt={variant.product.name} className="h-10 w-10 rounded-md object-cover border border-neutral-200" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-neutral-400">-</div>
                    )}
                    <Link href={`/admin/products/${variant.product.id}/edit`} className="font-medium text-neutral-900 hover:text-brand-600">
                      {variant.product.name}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4">{variant.label} ({variant.unit})</td>
                <td className="px-6 py-4 font-mono text-xs">{variant.sku}</td>
                <td className="px-6 py-4">
                  {variant.stock <= 0 ? (
                    <Badge statusColor="danger">Out of Stock</Badge>
                  ) : variant.stock <= variant.lowStockAt ? (
                    <Badge statusColor="warning">Low Stock</Badge>
                  ) : (
                    <Badge statusColor="success">In Stock</Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StockUpdater variantId={variant.id} initialStock={variant.stock} />
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  No inventory items found. Add products to manage their stock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}