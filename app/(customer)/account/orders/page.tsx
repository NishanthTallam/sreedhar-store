import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-987654321",
      date: "Oct 24, 2026",
      status: "Delivered",
      statusColor: "bg-brand-100 text-brand-700",
      total: "₹1,245",
      items: [
        { name: "Fresh Apples", image: "🍎" },
        { name: "Whole Wheat Bread", image: "🍞" },
        { name: "Organic Milk", image: "🥛" },
      ],
      extraItemsCount: 2,
    },
    {
      id: "ORD-987654322",
      date: "Oct 15, 2026",
      status: "Processing",
      statusColor: "bg-amber-100 text-amber-700",
      total: "₹850",
      items: [
        { name: "Basmati Rice", image: "🍚" },
        { name: "Olive Oil", image: "🫒" },
      ],
      extraItemsCount: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">My Orders</h1>
        <p className="mt-1 text-sm text-neutral-500">View your order history and track recent purchases.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-card transition-shadow overflow-hidden">
            <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Order Number</p>
                  <p className="font-semibold text-neutral-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date Placed</p>
                  <p className="font-medium text-neutral-900">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Amount</p>
                  <p className="font-medium text-neutral-900">{order.total}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${order.statusColor}`}>
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
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex h-12 w-12 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-2xl" title={item.name}>
                    {item.image}
                  </div>
                ))}
                {order.extraItemsCount > 0 && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-600">
                    +{order.extraItemsCount}
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}