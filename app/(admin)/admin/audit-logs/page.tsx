"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit-logs?limit=50")
      .then(res => res.json())
      .then(json => {
        if (json.success) setLogs(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-surface-500">Loading audit logs...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">System Audit Logs</h1>
        <p className="text-sm text-surface-500 mt-1">Track admin and system activity.</p>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-600">
            <thead className="bg-surface-50 text-xs uppercase text-surface-500 border-b border-surface-200">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Entity Type</th>
                <th className="px-6 py-3 font-medium">Entity ID</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-surface-500">No logs found</td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-surface-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-surface-500">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.user ? log.user.email : <span className="text-surface-400 italic">System</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-surface-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.entityType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                      {log.entityId || "-"}
                    </td>
                    <td className="px-6 py-4 text-xs max-w-xs truncate" title={log.metadata ? JSON.stringify(log.metadata) : ""}>
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
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