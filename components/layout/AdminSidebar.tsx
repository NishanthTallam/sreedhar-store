// components/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: "📦" },
      { label: "Categories", href: "/admin/categories", icon: "🏷️" },
      { label: "Brands", href: "/admin/brands", icon: "🏪" },
      { label: "Inventory", href: "/admin/inventory", icon: "📋" },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: "🛒" },
      { label: "Returns", href: "/admin/returns", icon: "↩️" },
      { label: "Coupons", href: "/admin/coupons", icon: "🎟️" },
      { label: "Payments", href: "/admin/payments", icon: "💳" },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Customers", href: "/admin/customers", icon: "👥" },
      { label: "Delivery Boys", href: "/admin/delivery-boys", icon: "🚴" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Banners", href: "/admin/banners", icon: "🖼️" },
      { label: "Reviews", href: "/admin/reviews", icon: "⭐" },
      { label: "Notifications", href: "/admin/notifications/send", icon: "🔔" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Reports", href: "/admin/reports", icon: "📈" },
      { label: "Analytics", href: "/admin/analytics", icon: "📉" },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: "📝" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "⚙️" },
      { label: "Security", href: "/admin/security", icon: "🔒" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-neutral-200 bg-white">
      {/* Logo area */}
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
          G
        </div>
        <div>
          <span className="text-base font-bold text-neutral-900">General Store</span>
          <span className="block text-[10px] font-medium text-brand-600 uppercase tracking-wider">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors"
        >
          <span>🏠</span>
          <span>View Store</span>
        </Link>
      </div>
    </aside>
  );
}
