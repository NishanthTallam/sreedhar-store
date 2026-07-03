import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { ReturnActions } from "@/components/admin/ReturnActions";

export default async function AdminReturnsPage() {
  const returns = await prisma.returnRequest.findMany({
    include: {
      order: { select: { orderNumber: true, user: { select: { name: true } } } },
      orderItem: {
        include: {
          variant: { include: { product: { select: { name: true } } } }
        }
      }
    },
    orderBy: { requestedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Return Requests</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage and process customer return requests.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Item</th>
              <th className="px-6 py-4 font-medium">Reason</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {returns.map((req) => (
              <tr key={req.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-medium text-neutral-900">{req.order.orderNumber}</td>
                <td className="px-6 py-4">{req.order.user.name}</td>
                <td className="px-6 py-4">
                  {req.orderItem.variant.product.name} ({req.orderItem.variant.label})
                </td>
                <td className="px-6 py-4">{req.reason}</td>
                <td className="px-6 py-4">
                  <Badge 
                    statusColor={
                      req.status === "APPROVED" ? "success" : 
                      req.status === "REJECTED" ? "danger" : 
                      req.status === "CLOSED" ? "info" : "warning"
                    }
                  >
                    {req.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 flex justify-end">
                  <ReturnActions returnId={req.id} currentStatus={req.status} />
                </td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                  No return requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}