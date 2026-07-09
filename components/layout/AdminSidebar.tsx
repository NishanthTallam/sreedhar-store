// components/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { 
  LayoutDashboard, ShoppingCart, Package, Grid2x2, Users, 
  TicketPercent, Boxes, BarChart3, LineChart, Star, Bell, 
  MessageSquare, Settings, ShieldCheck, CreditCard, 
  Store, Truck
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Grid2x2 },
      { label: "Brands", href: "/admin/brands", icon: Store },
      { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Returns", href: "/admin/returns", icon: Truck },
      { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Delivery Boys", href: "/admin/delivery-boys", icon: Truck },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Banners", href: "/admin/banners", icon: Star },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Notifications", href: "/admin/notifications/send", icon: Bell },
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Analytics", href: "/admin/analytics", icon: LineChart },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Security", href: "/admin/security", icon: ShieldCheck },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Close sidebar on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo area */}
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-200 px-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
            S
          </div>
          <div>
            <span className="text-base font-bold text-neutral-900">Sreedhar Store</span>
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
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-brand-50 text-brand-700"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
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
        <div className="shrink-0 border-t border-neutral-200 p-4">
          <Link
            href="/"
            onClick={() => onClose()}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-brand-600 transition-colors"
          >
            <Store className="h-5 w-5 shrink-0" />
            <span>View Store</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
