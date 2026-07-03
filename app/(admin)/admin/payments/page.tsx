import { prisma } from "@/lib/prisma";
import { PaymentTable } from "./PaymentTable";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        select: { orderNumber: true }
      }
    }
  });

  // Calculate some stats
  const totalCompleted = payments.filter(p => p.status === "COMPLETED").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingCount = payments.filter(p => p.status === "PENDING").length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payments Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track all transactions (COD & Online)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Collected</p>
          <h3 className="text-2xl font-bold text-gray-900">${totalCompleted.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Pending Collections</p>
          <h3 className="text-2xl font-bold text-gray-900">{pendingCount} <span className="text-sm font-normal text-gray-500">orders</span></h3>
        </div>
      </div>

      <PaymentTable payments={payments as any} />
    </div>
  );
}
