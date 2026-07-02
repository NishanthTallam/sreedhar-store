import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { ReturnStatus } from "@prisma/client";
import Image from "next/image";

export const metadata = {
  title: "My Returns | General Store",
};

export default async function CustomerReturnsPage() {
  const session = await requireAuth();

  const returns = await prisma.returnRequest.findMany({
    where: {
      order: {
        userId: session.user.id,
      },
    },
    include: {
      order: {
        select: { orderNumber: true },
      },
      orderItem: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, images: true },
              },
            },
          },
        },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  const getStatusBadgeColor = (status: ReturnStatus) => {
    switch (status) {
      case "REQUESTED":
        return "bg-blue-100 text-blue-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "REPLACEMENT_SCHEDULED":
        return "bg-yellow-100 text-yellow-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        My Returns
      </h1>

      {returns.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No returns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't requested any returns yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <ul role="list" className="divide-y divide-gray-200">
            {returns.map((req) => (
              <li key={req.id} className="p-6">
                <div className="flex items-center sm:items-start gap-6 flex-col sm:flex-row">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    {req.orderItem.variant.product.images.length > 0 ? (
                      <Image
                        src={req.orderItem.variant.product.images[0]}
                        alt={req.orderItem.variant.product.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">
                          {req.orderItem.variant.product.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Variant: {req.orderItem.variant.label}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Qty: {req.orderItem.quantity}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-900">Order:</span>{" "}
                          <Link href={`/account/orders/${req.orderId}`} className="text-blue-600 hover:underline">
                            #{req.order.orderNumber}
                          </Link>
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Requested on:</span>{" "}
                          {format(new Date(req.requestedAt), "MMM d, yyyy")}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Reason:</span> {req.reason}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(req.status)}`}>
                          {req.status.replace(/_/g, " ")}
                        </span>
                        {req.adminNote && (
                          <p className="text-xs text-gray-500 max-w-xs text-right">
                            <span className="font-medium">Note:</span> {req.adminNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
