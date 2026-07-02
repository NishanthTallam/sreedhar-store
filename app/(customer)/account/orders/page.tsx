import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";

export const metadata = {
  title: "My Orders | General Store",
};

export default async function OrdersPage() {
  const session = await requireAuth();

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      },
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
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          You haven't placed any orders yet.
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-1 flex-col gap-2 p-6">
                <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                  <span className="font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Placed on {format(new Date(order.createdAt), "MMM d, yyyy")}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 && "s"} • Total: ₹
                  {order.totalAmount.toString()}
                </div>
                <div className="text-sm text-gray-500 truncate max-w-sm sm:max-w-md">
                  {order.items.map((item: any) => item.variant.product.name).join(", ")}
                </div>
              </div>
              <div className="border-t border-gray-200 p-6 sm:border-l sm:border-t-0 sm:bg-gray-50">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}