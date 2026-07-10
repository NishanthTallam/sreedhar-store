"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CurrencyDollarIcon, ShoppingBagIcon, UsersIcon, ClockIcon } from "@heroicons/react/24/outline";

// Lazy load recharts components — they are very heavy (~200KB)
const LazyAreaChart = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.AreaChart })),
  { ssr: false }
);
const LazyBarChart = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.BarChart })),
  { ssr: false }
);
const LazyResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.ResponsiveContainer })),
  { ssr: false }
);
const LazyArea = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Area })),
  { ssr: false }
);
const LazyBar = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Bar })),
  { ssr: false }
);
const LazyXAxis = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.XAxis })),
  { ssr: false }
);
const LazyYAxis = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.YAxis })),
  { ssr: false }
);
const LazyCartesianGrid = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.CartesianGrid })),
  { ssr: false }
);
const LazyTooltip = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Tooltip })),
  { ssr: false }
);

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-neutral-500">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load analytics</div>;

  const { kpi, chartData } = data;

  const kpiCards = [
    { name: "Total Revenue", value: `$${kpi.totalRevenue.toFixed(2)}`, icon: CurrencyDollarIcon, color: "text-green-600", bg: "bg-green-100" },
    { name: "Total Orders", value: kpi.totalOrders, icon: ShoppingBagIcon, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Pending Orders", value: kpi.pendingOrders, icon: ClockIcon, color: "text-yellow-600", bg: "bg-yellow-100" },
    { name: "Active Customers", value: kpi.activeCustomers, icon: UsersIcon, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="text-sm text-neutral-500 mt-1">Key metrics and recent performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">{card.name}</p>
              <h3 className="text-2xl font-bold text-neutral-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-neutral-900">Revenue (Last 30 Days)</h2>
          <div className="h-72 w-full">
            <LazyResponsiveContainer width="100%" height="100%">
              <LazyAreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <LazyCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <LazyXAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} minTickGap={30} />
                <LazyYAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <LazyTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <LazyArea type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </LazyAreaChart>
            </LazyResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-neutral-900">Orders (Last 30 Days)</h2>
          <div className="h-72 w-full">
            <LazyResponsiveContainer width="100%" height="100%">
              <LazyBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <LazyCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <LazyXAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} minTickGap={30} />
                <LazyYAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <LazyTooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [value, 'Orders']}
                />
                <LazyBar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </LazyBarChart>
            </LazyResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}