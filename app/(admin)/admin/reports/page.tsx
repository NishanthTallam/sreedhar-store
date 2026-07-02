"use client";

import { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Reusing analytics API for some basic data for the report, in reality you'd have a specialized /api/reports route
  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    const { chartData } = data;
    
    // Simple CSV generation from chart data
    const headers = ["Date", "Sales", "Orders"];
    const csvContent = [
      headers.join(","),
      ...chartData.map((row: any) => `${row.date},${row.sales},${row.orders}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-surface-500">Loading reports...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load reports</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Custom Reports</h1>
          <p className="text-sm text-surface-500 mt-1">Generate and export store performance reports.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-lg bg-surface-900 px-4 py-2 text-sm font-medium text-white hover:bg-surface-800"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 bg-surface-50">
          <h3 className="font-semibold text-surface-900">Daily Sales Report (Last 30 Days)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-600">
            <thead className="bg-surface-50 text-xs uppercase text-surface-500 border-b border-surface-200">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Sales ($)</th>
                <th className="px-6 py-3 font-medium">Orders Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {data.chartData.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-surface-50/50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-surface-900">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${row.sales.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}