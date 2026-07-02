import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Delivery Boys | Admin",
};

export default async function AdminDeliveryBoysPage() {
  const session = await requireAuth();
  if ((session.user as any).role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const deliveryBoys = await prisma.user.findMany({
    where: { role: "DELIVERY_BOY" },
    include: {
      _count: {
        select: { deliveries: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Delivery Personnel
        </h1>
        <button
          disabled
          className="cursor-not-allowed rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm opacity-50"
          title="Creation via dashboard coming in next phase. Add via db script for now."
        >
          Add Delivery Boy
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email / Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Assigned Orders
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {deliveryBoys.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                  No delivery personnel found. Add a user with role DELIVERY_BOY in the database to see them here.
                </td>
              </tr>
            ) : (
              deliveryBoys.map((boy: any) => (
                <tr key={boy.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {boy.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="text-gray-900">{boy.email}</div>
                    <div className="text-gray-400">{boy.phone || "No phone"}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${boy.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                      {boy.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {boy._count.deliveries} total
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/admin/customers/${boy.id}`} className="text-blue-600 hover:text-blue-900">
                      View Profile
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