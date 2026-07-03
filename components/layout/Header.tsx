import * as React from "react"
import Link from "next/link"
import { Search, MapPin, Heart, Bell, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/Drawer"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile: Hamburger & Logo */}
        <div className="flex items-center gap-4 md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent side="left">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <nav className="flex flex-col gap-4 py-4">
                <Link href="/" className="text-sm font-medium">Home</Link>
                <Link href="/products" className="text-sm font-medium">All Products</Link>
                <Link href="/account/orders" className="text-sm font-medium">My Orders</Link>
                <Link href="/account/wishlist" className="text-sm font-medium">Wishlist</Link>
                <Link href="/help" className="text-sm font-medium">Help & Support</Link>
              </nav>
            </DrawerContent>
          </Drawer>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-700">General Store</span>
          </Link>
        </div>

        {/* Desktop: Logo & Location */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-700">General Store</span>
          </Link>
          <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-brand-600 transition-colors">
            <MapPin className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-neutral-500">Delivering to</span>
              <span className="font-medium text-neutral-900 line-clamp-1 max-w-[120px]">Select Location</span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4 max-w-2xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input 
              type="search" 
              placeholder="Search for groceries, fresh food, household..." 
              className="w-full pl-9 bg-neutral-50 border-transparent focus:border-brand-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="px-2">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <Link href="/account/wishlist" className="hidden md:flex">
            <Button variant="ghost" size="sm" className="px-2">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>
          <Link href="/account/notifications" className="hidden sm:flex">
            <Button variant="ghost" size="sm" className="px-2 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]" statusColor="danger">3</Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="px-2 relative text-neutral-900">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]" statusColor="success">2</Badge>
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <Link href="/account" className="hidden md:flex">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">Account</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
