import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";
import Image from "next/image";

export const metadata = {
  title: "Order Details | General Store",
};

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PLACED", label: "Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PACKED", label: "Packed" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "DELIVERED", label: "Delivered" },
];

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();

  const order = await prisma.order.findUnique({
    where: {
      id: (await props.params).id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, images: true, brand: { select: { name: true } } },
              },
            },
          },
        },
      },
      address: true,
      deliveryBoy: {
        select: { name: true, phone: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Determine current step index
  let currentStepIndex = STEPS.findIndex((s) => s.status === order.status);
  
  // If cancelled or rejected, we don't show normal progression
  const isCancelledOrRejected = order.status === "CANCELLED" || order.status === "REJECTED";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/account/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        
        {/* Actions (Cancel, Invoice) */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <a
            href={`/api/orders/${order.id}/invoice`}
            target="_blank"
            className="inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-600 shadow-sm ring-1 ring-inset ring-brand-300 hover:bg-brand-50"
          >
            Download Invoice
          </a>
          {(order.status === "PLACED" || order.status === "CONFIRMED") && (
            <form action={`/api/orders/${order.id}/status`} method="POST">
              <input type="hidden" name="status" value="CANCELLED" />
              <button
                type="submit"
                className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
              >
                Cancel Order
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Status Stepper */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Order Status</h2>
        
        {isCancelledOrRejected ? (
          <div className="flex items-center gap-3 rounded-md bg-red-50 p-4 text-red-700">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{order.status === "CANCELLED" ? "Order Cancelled" : "Order Rejected"}</span>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-200" aria-hidden="true"></div>
            <div className="relative flex justify-between">
              {STEPS.map((step, stepIdx) => {
                const isCompleted = currentStepIndex >= stepIdx;
                const isCurrent = currentStepIndex === stepIdx;
                
                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        isCompleted ? "bg-blue-600" : "bg-gray-200"
                      } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                    >
                      {isCompleted ? (
                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${isCompleted ? "text-blue-600" : "text-gray-500"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {order.status === "OUT_FOR_DELIVERY" && order.deliveryBoy && (
          <div className="mt-8 rounded-md bg-blue-50 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Assigned Delivery Partner</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Name: <span className="font-semibold">{order.deliveryBoy.name}</span></p>
                  <p>Contact: {order.deliveryBoy.phone || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {order.items.map((item: any) => (
            <li key={item.id} className="flex p-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                {item.variant.product.images[0] ? (
                  <img
                    src={item.variant.product.images[0]}
                    alt={item.variant.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.variant.product.name}</h3>
                    <p className="ml-4">₹{item.priceAtOrder.toString()}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.variant.product.brand?.name}</p>
                  <p className="mt-1 text-sm text-gray-500">Variant: {item.variant.label}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Summary & Address */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h2>
          <address className="not-italic text-sm text-gray-600">
            <span className="block font-semibold text-gray-900">{order.address.fullName}</span>
            <span className="block mt-1">{order.address.houseNo}, {order.address.street}</span>
            {order.address.landmark && <span className="block">{order.address.landmark}</span>}
            <span className="block">{order.address.city}, {order.address.state} {order.address.pincode}</span>
            <span className="block mt-2">Mobile: {order.address.mobile}</span>
          </address>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <dl className="space-y-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-medium text-gray-900">₹{order.subtotal.toString()}</dd>
            </div>
            {order.discountAmount && Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Discount</dt>
                <dd>-₹{order.discountAmount.toString()}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Delivery Charge</dt>
              <dd className="font-medium text-gray-900">
                {Number(order.deliveryCharge) === 0 ? "Free" : `₹${order.deliveryCharge.toString()}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-medium text-gray-900">
              <dt>Total Amount</dt>
              <dd>₹{order.totalAmount.toString()}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt>Payment Method</dt>
              <dd className="font-medium text-gray-900">{order.paymentMethod}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}