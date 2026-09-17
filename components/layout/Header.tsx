"use client";

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, MapPin, Heart, Bell, User, Menu, LogOut, Package, ShoppingCart, X, Home, Grid, MessageCircle, Key, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/Drawer"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu"
import { Avatar } from "@/components/ui/Avatar"
import { useSession, signOut } from "@/lib/auth-client"
import { useNotifications } from "@/components/providers/NotificationProvider"
import { useStore } from "@/store/useStore"

export function Header() {
  const { data: session } = useSession();
  const { wishlistData, cartData } = useStore();
  const wishlistCount = wishlistData?.length || 0;
  const cartCount = cartData?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locationName, setLocationName] = React.useState("Select Location");
  const [searchQuery, setSearchQuery] = React.useState(searchParams?.get("q") || "");
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const searchRef = React.useRef<HTMLFormElement>(null);
  const mobileSearchRef = React.useRef<HTMLFormElement>(null);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    // Attempt to fetch location on mount
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      // Only fetch if we haven't successfully fetched before in this session to avoid spamming the user/API
      if (!sessionStorage.getItem("user_location")) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown Location";
                setLocationName(city);
                sessionStorage.setItem("user_location", city);
              }
            } catch (err) {
              console.error("Failed to reverse geocode", err);
            }
          },
          (err) => {
            // Silently handle and prevent repeated prompts if denied
            sessionStorage.setItem("user_location", "Select Location");
          }
        );
      } else {
        setLocationName(sessionStorage.getItem("user_location") || "Select Location");
      }
    }
  }, []);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const json = await res.json();
          setSuggestions(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch search suggestions", error);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setShowMobileSearch(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowMobileSearch(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
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
              <DrawerHeader className="border-b border-neutral-100 pb-4">
                <DrawerTitle className="sr-only">Menu</DrawerTitle>
                {isMounted && session ? (
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={session.user.name || "User"}
                      src={session.user.image || undefined}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
                      <User className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Welcome</p>
                      <DrawerClose asChild>
                        <Link prefetch={false} href="/login" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                          Sign in to your account →
                        </Link>
                      </DrawerClose>
                    </div>
                  </div>
                )}
              </DrawerHeader>

              <nav className="flex-1 overflow-y-auto py-3">
                {/* Main Navigation */}
                <div className="px-2 mb-2">
                  <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Browse</p>
                  {[
                    { href: "/", icon: Home, label: "Home" },
                    { href: "/products", icon: Package, label: "All Products" },
                    { href: "/categories", icon: Grid, label: "Categories" },
                  ].map((item) => (
                    <DrawerClose key={item.href} asChild>
                      <Link prefetch={false}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-neutral-400" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                      </Link>
                    </DrawerClose>
                  ))}
                </div>

                <div className="mx-4 my-2 border-t border-neutral-100" />

                {/* Account Section */}
                <div className="px-2 mb-2">
                  <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">My Account</p>
                  {[
                    { href: "/account", icon: User, label: "My Profile", count: 0 },
                    { href: "/account/orders", icon: Package, label: "My Orders", count: 0 },
                    { href: "/account/wishlist", icon: Heart, label: "Wishlist", count: wishlistCount },
                    { href: "/cart", icon: ShoppingCart, label: "Cart", count: cartCount },
                    { href: "/account/notifications", icon: Bell, label: "Notifications", count: unreadCount },
                  ].map((item) => (
                    <DrawerClose key={item.href} asChild>
                      <Link prefetch={false}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-neutral-400" />
                        <span className="flex-1">{item.label}</span>
                        {item.count > 0 && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                            {item.count > 99 ? "99+" : item.count}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                      </Link>
                    </DrawerClose>
                  ))}
                </div>

                <div className="mx-4 my-2 border-t border-neutral-100" />

                {/* Support */}
                <div className="px-2">
                  <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Support</p>
                  {[
                    { href: "/account/help", icon: MessageCircle, label: "Help & Support" },
                    { href: "/account/change-password", icon: Key, label: "Change Password" },
                  ].map((item) => (
                    <DrawerClose key={item.href} asChild>
                      <Link prefetch={false}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-neutral-400" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                      </Link>
                    </DrawerClose>
                  ))}
                </div>
              </nav>

              {/* Sign Out — pinned to bottom */}
              {isMounted && session && (
                <div className="border-t border-neutral-100 p-4 mt-auto">
                  <button
                    onClick={async () => { await signOut(); window.location.href = "/login"; }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:border-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </DrawerContent>
          </Drawer>
          <Link prefetch={false} href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-700">Sreedhar Store</span>
          </Link>
        </div>

        {/* Desktop: Logo & Location */}
        <div className="hidden md:flex items-center gap-8">
          <Link prefetch={false} href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-700">Sreedhar Store</span>
          </Link>
          <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-brand-600 transition-colors">
            <MapPin className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-neutral-500">Delivering to</span>
              <span className="font-medium text-neutral-900 line-clamp-1 max-w-[120px]">{locationName}</span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4 max-w-2xl hidden md:block">
          <form ref={searchRef} onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input 
              type="search" 
              name="q"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for groceries, fresh food, household..." 
              className="w-full pl-9 bg-neutral-50 border-transparent focus:border-brand-500 focus:bg-white"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <Link prefetch={false} 
                    key={product.id} 
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                    onClick={() => setShowSuggestions(false)}
                  >
                    {product.images?.[0] && (
                      <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover rounded-md" />
                    )}
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium text-neutral-900 line-clamp-1">{product.name}</span>
                      <span className="text-xs text-neutral-500">{product.brand?.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile search button — opens inline overlay */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="px-2" onClick={() => setShowMobileSearch((v) => !v)}>
              {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              <span className="sr-only">Search</span>
            </Button>
          </div>
          
          {isMounted && session && (
            <Link prefetch={false} href="/account/wishlist" className="hidden md:flex">
              <Button variant="ghost" size="sm" className="px-2 relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]" statusColor="warning">
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
          )}

          {/* Cart icon with count — desktop only */}
          {isMounted && session && (
            <Link prefetch={false} href="/cart" className="hidden md:flex">
              <Button variant="ghost" size="sm" className="px-2 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]" statusColor="danger">
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          )}

          {isMounted && session ? (
            <Link prefetch={false} href="/account/notifications">
              <Button variant="ghost" size="sm" className="px-2 relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]" statusColor="danger">
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" className="px-2 relative" disabled>
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          )}

          <div className="hidden md:flex items-center">
            {!isMounted ? (
              <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
            ) : session ? (
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar 
                      name={session.user.name || "User"} 
                      src={session.user.image || undefined} 
                      size="sm" 
                    />
                  </Button>
                }
              >
                <div className="px-4 py-2 border-b border-neutral-100 mb-1">
                  <p className="text-sm font-medium text-neutral-900 truncate">{session.user.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                </div>
                <DropdownMenuItem href="/account">
                  <span className="flex items-center gap-2"><User className="h-4 w-4" /> My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem href="/account/orders">
                  <span className="flex items-center gap-2"><Package className="h-4 w-4" /> My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem href="/account/wishlist">
                  <span className="flex items-center gap-2"><Heart className="h-4 w-4" /> Wishlist</span>
                </DropdownMenuItem>
                <div className="border-t border-neutral-100 my-1"></div>
                <DropdownMenuItem onClick={async () => { await signOut(); window.location.reload(); }}>
                  <span className="flex items-center gap-2 text-red-600"><LogOut className="h-4 w-4" /> Sign out</span>
                </DropdownMenuItem>
              </DropdownMenu>
            ) : (
              <Link prefetch={false} href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-brand-600">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile search overlay */}
    {showMobileSearch && (
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-neutral-200 shadow-lg px-4 py-3">
        <form ref={mobileSearchRef} onSubmit={handleMobileSearch} className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              type="search"
              name="q"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 bg-neutral-50"
            />
          </div>
          <Button type="submit" size="sm" className="bg-brand-600 text-white hover:bg-brand-700 px-4">
            Search
          </Button>
        </form>
      </div>
    )}
    </>
  )
}
