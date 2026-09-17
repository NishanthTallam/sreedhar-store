// components/layout/CustomerSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package, Heart, Bell, MessageCircle, Key } from "lucide-react";
import { motion } from "framer-motion";
import { FloatCard } from "@/components/ui/motion/FloatCard";

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
    <aside className="w-full shrink-0 md:w-64 hidden md:block">
      <FloatCard
        liftPx={4}
        tiltDeg={2}
        delay={0}
        className="rounded-xl border border-neutral-200/80 bg-white/90 backdrop-blur-sm overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,0.07)]"
      >
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">My Account</h2>
        </div>
        <ul className="p-2">
          {navItems.map((item, i) => {
            const isActive =
              item.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.06 }}
              >
                <Link prefetch={false}
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-brand-50"
                      style={{ zIndex: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? "text-brand-600" : ""}`} />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-indicator"
                      className="absolute right-2 h-1.5 w-1.5 rounded-full bg-brand-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </FloatCard>
    </aside>
  );
}

