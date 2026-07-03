import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { CustomerActions } from "@/components/admin/CustomerActions";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Customers & Users</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage users, their roles, and access.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email / Phone</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Role & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {users.map((user) => (
              <tr key={user.id} className={`hover:bg-neutral-50 ${user.isBlocked ? 'bg-red-50/50' : ''}`}>
                <td className="px-6 py-4 font-medium text-neutral-900">{user.name}</td>
                <td className="px-6 py-4">
                  <div>{user.email}</div>
                  {user.phone && <div className="text-xs text-neutral-500">{user.phone}</div>}
                </td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {user.isBlocked ? (
                    <Badge statusColor="danger">Blocked</Badge>
                  ) : (
                    <Badge statusColor="success">Active</Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <CustomerActions userId={user.id} isBlocked={user.isBlocked} role={user.role} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}