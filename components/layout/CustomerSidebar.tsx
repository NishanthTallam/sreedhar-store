// components/layout/CustomerSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package, Heart, Bell, MessageCircle, Key } from "lucide-react";

const navItems = [
  { label: "My Profile", href: "/account", icon: User },
  { label: "Addresses", href: "/account/address", icon: MapPin },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Help & Support", href: "/account/help", icon: MessageCircle },
  { label: "Change Password", href: "/account/change-password", icon: Key },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-64">
      <nav className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">My Account</h2>
        </div>
        <ul className="p-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
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
