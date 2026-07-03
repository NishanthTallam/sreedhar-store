import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";

export const metadata = {
  title: "Order Details | Admin",
};

export default async function AdminOrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const userRole = (session.user as any).role;
  const isDeliveryBoy = userRole === "DELIVERY_BOY";
  const isAdmin = userRole === "ADMIN";

  if (!isDeliveryBoy && !isAdmin) {
    throw new Error("Forbidden");
  }

  const order = await prisma.order.findUnique({
    where: { id: (await props.params).id },
    include: {
      user: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, brand: { select: { name: true } } },
              },
            },
          },
        },
      },
      address: true,
      deliveryBoy: true,
      statusHistory: {
        orderBy: { changedAt: "desc" }
      }
    },
  });

  if (!order) {
    notFound();
  }

  if (isDeliveryBoy && order.deliveryBoyId !== session.user.id) {
    throw new Error("Forbidden: This order is not assigned to you.");
  }

  // Admin assigning a delivery boy:
  const deliveryBoys = isAdmin ? await prisma.user.findMany({
    where: { role: "DELIVERY_BOY" },
    select: { id: true, name: true }
  }) : [];

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
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
          <div className="mt-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="flex flex-wrap gap-2">
          {isAdmin && order.status === "PLACED" && (
            <form action={`/api/orders/${order.id}/status`} method="POST" className="inline-block">
              <input type="hidden" name="status" value="CONFIRMED" />
              <button
                type="submit"
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                Accept Order
              </button>
            </form>
          )}
          {isAdmin && order.status === "PLACED" && (
            <form action={`/api/orders/${order.id}/status`} method="POST" className="inline-block">
              <input type="hidden" name="status" value="REJECTED" />
              <button
                type="submit"
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
              >
                Reject Order
              </button>
            </form>
          )}

          {isAdmin && order.status === "CONFIRMED" && (
            <form action={`/api/orders/${order.id}/status`} method="POST" className="inline-block">
              <input type="hidden" name="status" value="PACKED" />
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Mark as Packed
              </button>
            </form>
          )}

          {isAdmin && order.status === "PACKED" && (
            <form action={`/api/orders/${order.id}/status`} method="POST" className="inline-block">
              <input type="hidden" name="status" value="OUT_FOR_DELIVERY" />
              <button
                type="submit"
                className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
              >
                Mark Out for Delivery
              </button>
            </form>
          )}
          
          {(isAdmin || isDeliveryBoy) && order.status === "OUT_FOR_DELIVERY" && (
            <form action={`/api/orders/${order.id}/status`} method="POST" className="inline-block">
              <input type="hidden" name="status" value="DELIVERED" />
              <button
                type="submit"
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                Mark as Delivered
              </button>
            </form>
          )}

          {isAdmin && (
            <a
              href={`/admin/orders/${order.id}/invoice`}
              target="_blank"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Invoice
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (Items & Delivery Boy) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Order Items */}
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Items ({order.items.length})</h2>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {order.items.map((item: any) => (
                <li key={item.id} className="flex px-6 py-4">
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex justify-between text-sm font-medium text-gray-900">
                      <h3>{item.variant.product.name}</h3>
                      <p className="ml-4">₹{item.priceAtOrder.toString()}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.variant.product.brand?.name}</p>
                    <p className="mt-1 text-sm text-gray-500">Variant: {item.variant.label}</p>
                  </div>
                  <div className="ml-6 flex items-center">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <dl className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">₹{order.subtotal.toString()}</dd>
                </div>
                {order.discountAmount && Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>Discount</dt>
                    <dd>-₹{order.discountAmount.toString()}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Delivery Charge</dt>
                  <dd className="text-gray-900">
                    {Number(order.deliveryCharge) === 0 ? "Free" : `₹${order.deliveryCharge.toString()}`}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-medium text-gray-900 text-base">
                  <dt>Total</dt>
                  <dd>₹{order.totalAmount.toString()}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Delivery Assignment */}
          {isAdmin && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Delivery Assignment</h2>
              </div>
              <div className="p-6">
                <form action={`/api/orders/${order.id}/assign-delivery`} method="POST" className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="deliveryBoyId" className="sr-only">Assign Delivery Boy</label>
                    <select
                      id="deliveryBoyId"
                      name="deliveryBoyId"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      defaultValue={order.deliveryBoyId || ""}
                    >
                      <option value="" disabled>Select Delivery Boy</option>
                      {deliveryBoys.map(db => (
                        <option key={db.id} value={db.id}>{db.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Assign
                  </button>
                </form>
                {order.deliveryBoy && (
                  <p className="mt-4 text-sm text-gray-600">
                    Currently assigned to: <span className="font-medium text-gray-900">{order.deliveryBoy.name}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Customer Info & Status History) */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Customer Details</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900">Account</h3>
                <p className="mt-1 text-sm text-gray-600">{order.user.name}</p>
                <p className="text-sm text-gray-600">{order.user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
                <address className="not-italic text-sm text-gray-600 mt-1">
                  <span className="block font-semibold text-gray-900">{order.address.fullName}</span>
                  <span className="block mt-1">{order.address.houseNo}, {order.address.street}</span>
                  {order.address.landmark && <span className="block">{order.address.landmark}</span>}
                  <span className="block">{order.address.city}, {order.address.state} {order.address.pincode}</span>
                  <span className="block mt-2">Phone: {order.address.mobile}</span>
                </address>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Status History</h2>
            </div>
            <div className="p-6">
              <ul role="list" className="-mb-8">
                {order.statusHistory.map((log: any, logIdx: any) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {logIdx !== order.statusHistory.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                            <div className={`h-2.5 w-2.5 rounded-full ${getStatusBadgeColor(log.status).split(' ')[0]}`} />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              Changed to <span className="font-medium text-gray-900">{log.status.replace(/_/g, " ")}</span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            <time dateTime={log.changedAt.toISOString()}>
                              {format(new Date(log.changedAt), "MMM d, HH:mm")}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {order.statusHistory.length === 0 && (
                <p className="text-sm text-gray-500">No status history available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}