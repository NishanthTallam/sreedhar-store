"use client";

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, MapPin, Heart, Bell, ShoppingCart, User, Menu, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/Drawer"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu"
import { Avatar } from "@/components/ui/Avatar"
import { useSession, signOut } from "@/lib/auth-client"
import { useNotifications } from "@/components/providers/NotificationProvider"
import { useStore } from "@/store/useStore"

export function Header() {
  const { data: session } = useSession();
  const { cartData, wishlistData } = useStore();
  const cartCount = cartData?.items?.length || 0;
  const wishlistCount = wishlistData?.length || 0;
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locationName, setLocationName] = React.useState("Select Location");
  const [searchQuery, setSearchQuery] = React.useState(searchParams?.get("q") || "");
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchRef = React.useRef<HTMLFormElement>(null);

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
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
            <span className="text-xl font-bold text-brand-700">Sreedhar Store</span>
          </Link>
        </div>

        {/* Desktop: Logo & Location */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
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
                  <Link 
                    key={product.id} 
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                    onClick={() => setShowSuggestions(false)}
                  >
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
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
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="px-2">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          
          {session && (
            <Link href="/account/wishlist" className="hidden md:flex">
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
          
          {session && (
            <Link href="/account/notifications" className="hidden sm:flex">
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
          )}

          <Link href="/cart">
            <Button variant="ghost" size="sm" className="px-2 relative text-neutral-900">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]" statusColor="success">
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <div className="hidden md:flex items-center">
            {session ? (
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
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-brand-600">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
