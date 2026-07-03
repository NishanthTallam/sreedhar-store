import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { CouponActions } from "@/components/admin/CouponActions";
import { CreateCouponForm } from "@/components/admin/CreateCouponForm";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Discount Coupons</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage promotional codes and discounts.</p>
        </div>
      </div>

      <CreateCouponForm />

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className={`hover:bg-neutral-50 ${!coupon.isActive ? 'opacity-50 grayscale' : ''}`}>
                <td className="px-6 py-4 font-mono font-medium text-neutral-900">{coupon.code}</td>
                <td className="px-6 py-4">
                  {coupon.type === "PERCENTAGE" ? `${Number(coupon.value)}%` : `₹${Number(coupon.value)}`}
                  {coupon.minOrderValue && <div className="text-xs text-neutral-400">Min: ₹{Number(coupon.minOrderValue)}</div>}
                </td>
                <td className="px-6 py-4">
                  {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'uses'}
                </td>
                <td className="px-6 py-4">
                  {coupon.isActive ? (
                    <Badge statusColor="success">Active</Badge>
                  ) : (
                    <Badge statusColor="neutral">Disabled</Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <CouponActions couponId={coupon.id} isActive={coupon.isActive} />
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  No coupons found. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}