import { requireAuth, hasRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";

export const metadata = {
  title: "Orders Management | Admin",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: OrderStatus };
}) {
  const session = await requireAuth();
  
  // Delivery boys can only see their assigned orders.
  // Admins can see all orders.
  const isDeliveryBoy = (session.user as any).role === "DELIVERY_BOY";
  const isAdmin = (session.user as any).role === "ADMIN";

  if (!isDeliveryBoy && !isAdmin) {
    throw new Error("Forbidden");
  }

  const whereClause: any = {};
  if (isDeliveryBoy) {
    whereClause.deliveryBoyId = session.user.id;
  }
  if (searchParams.status) {
    whereClause.status = searchParams.status;
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      deliveryBoy: { select: { name: true } },
    },
  });

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
        return "bg-indigo-100 text-indigo-800";
      case "PACKED":
        return "bg-yellow-100 text-yellow-800";
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {isDeliveryBoy ? "My Assigned Deliveries" : "All Orders"}
        </h1>
        {isAdmin && (
          <div className="flex gap-2">
            <Link
              href="/admin/orders"
              className={`rounded px-3 py-1 text-sm font-medium ${!searchParams.status ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All
            </Link>
            <Link
              href="/admin/orders?status=PLACED"
              className={`rounded px-3 py-1 text-sm font-medium ${searchParams.status === "PLACED" ? "bg-blue-200 text-blue-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Placed
            </Link>
            <Link
              href="/admin/orders?status=PACKED"
              className={`rounded px-3 py-1 text-sm font-medium ${searchParams.status === "PACKED" ? "bg-yellow-200 text-yellow-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Packed
            </Link>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              {isAdmin && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Delivery Boy
                </th>
              )}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{order.user.name}</div>
                    <div className="text-gray-400">{order.user.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {format(new Date(order.createdAt), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{order.totalAmount.toString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {order.deliveryBoy ? order.deliveryBoy.name : <span className="text-gray-400 italic">Unassigned</span>}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}