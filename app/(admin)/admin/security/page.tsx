import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import { format } from "date-fns";

export default async function SecurityPage() {
  await requireAdmin();

  const logins = await prisma.loginHistory.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { email: true, name: true, role: true } },
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Security & Logins</h1>
        <p className="text-sm text-surface-500 mt-1">Monitor recent login activity across the store.</p>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 bg-surface-50 flex justify-between items-center">
          <h3 className="font-semibold text-surface-900">Recent Logins</h3>
          <span className="text-xs text-surface-500">Last 50 attempts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-600">
            <thead className="bg-surface-50 text-xs uppercase text-surface-500 border-b border-surface-200">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">User Agent</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {logins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-surface-500">No login history found</td>
                </tr>
              ) : (
                logins.map((login) => (
                  <tr key={login.id} className="hover:bg-surface-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-surface-500">
                      {format(new Date(login.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {login.user ? login.user.email : <span className="text-surface-400 italic">Unknown</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {login.user ? (
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          login.user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-surface-100 text-surface-700'
                        }`}>
                          {login.user.role}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                      {login.ipAddress || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs max-w-[200px] truncate" title={login.userAgent || ""}>
                      {login.userAgent || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        login.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {login.success ? "Success" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}