import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const session = await requireAuth();

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">My Orders</h1>
        <p className="mt-1 text-sm text-neutral-500">View your order history and track recent purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 border border-neutral-200 rounded-xl">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusColors: Record<string, string> = {
              PLACED: "bg-blue-100 text-blue-700",
              CONFIRMED: "bg-indigo-100 text-indigo-700",
              PACKED: "bg-yellow-100 text-yellow-700",
              OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
              DELIVERED: "bg-green-100 text-green-700",
              CANCELLED: "bg-red-100 text-red-700",
              REJECTED: "bg-red-100 text-red-700",
            };
            const statusColor = statusColors[order.status] || "bg-neutral-100 text-neutral-700";

            return (
              <div key={order.id} className="rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-card transition-shadow overflow-hidden">
                <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Order Number</p>
                      <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date Placed</p>
                      <p className="font-medium text-neutral-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Amount</p>
                      <p className="font-medium text-neutral-900">₹{order.totalAmount.toString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
                      {order.status}
                    </span>
                    <Link 
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={item.id} className="flex h-12 w-12 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-xs text-center p-1 overflow-hidden" title={item.variant.product.name}>
                        {/* Placeholder for real images */}
                        {item.variant.product.images?.[0] ? (
                          <img src={item.variant.product.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-neutral-400" />
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}