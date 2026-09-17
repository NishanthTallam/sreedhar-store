"use client";

import Link from "next/link";
import { User, MapPin, Package, Heart, Bell, MessageCircle, Key, ChevronRight, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Avatar } from "@/components/ui/Avatar";

interface AccountMobileHubProps {
  userName: string;
  userEmail: string;
  userImage?: string;
}

const accountLinks = [
  { label: "My Profile", href: "/account/profile", icon: User, description: "View and edit your details", color: "bg-blue-50 text-blue-600" },
  { label: "Addresses", href: "/account/address", icon: MapPin, description: "Manage delivery addresses", color: "bg-emerald-50 text-emerald-600" },
  { label: "Orders", href: "/account/orders", icon: Package, description: "Track your orders", color: "bg-violet-50 text-violet-600" },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart, description: "Items you've saved", color: "bg-pink-50 text-pink-600" },
  { label: "Notifications", href: "/account/notifications", icon: Bell, description: "Updates & alerts", color: "bg-amber-50 text-amber-600" },
  { label: "Help & Support", href: "/account/help", icon: MessageCircle, description: "Get help or contact us", color: "bg-cyan-50 text-cyan-600" },
  { label: "Change Password", href: "/account/change-password", icon: Key, description: "Update your password", color: "bg-slate-50 text-slate-600" },
];

export function AccountMobileHub({ userName, userEmail, userImage }: AccountMobileHubProps) {
  return (
    <div className="space-y-5">
      {/* User Info Header */}
      <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar name={userName} src={userImage} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-neutral-900 truncate">{userName}</h1>
            <p className="text-sm text-neutral-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="space-y-2">
        {accountLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-900">{item.label}</p>
                <p className="text-xs text-neutral-500">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
            </Link>
          );
        })}
      </div>

      {/* Sign Out */}
      <button
        onClick={async () => { await signOut(); window.location.href = "/login"; }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:border-red-300 active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
