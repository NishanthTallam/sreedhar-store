"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomTabBar() {
  const pathname = usePathname()

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: Grid },
    { name: "Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Account", href: "/account", icon: User },
  ]

  // Hide on auth, admin, and specific checkout pages if needed, but for now just show universally on mobile
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-neutral-200 bg-white md:hidden">
      <div className="flex h-16 items-center justify-around px-2 pb-safe">
        {tabs.map((tab) => {
          // Exact match for home and categories; prefix match for others
          const isActive =
            tab.href === "/" || tab.href === "/categories"
              ? pathname === tab.href
              : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "relative flex w-full flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors",
                isActive ? "text-brand-600" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <div className="relative">
                <tab.icon className={cn("h-6 w-6", isActive && "fill-brand-50")} />
              </div>
              <span>{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
