// components/layout/CustomerSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "My Profile", href: "/account", icon: "👤" },
  { label: "Addresses", href: "/account/address", icon: "📍" },
  { label: "Orders", href: "/account/orders", icon: "📦" },
  { label: "Wishlist", href: "/account/wishlist", icon: "❤️" },
  { label: "Notifications", href: "/account/notifications", icon: "🔔" },
  { label: "Help & Support", href: "/account/help", icon: "💬" },
  { label: "Change Password", href: "/account/change-password", icon: "🔑" },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-64">
      <nav className="rounded-xl border border-surface-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100">
          <h2 className="text-sm font-semibold text-surface-900">My Account</h2>
        </div>
        <ul className="p-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
