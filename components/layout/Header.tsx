"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-lg">
            G
          </div>
          <span className="text-xl font-bold tracking-tight text-surface-900 hidden sm:block">
            General Store
          </span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-surface-200 bg-surface-50 py-2 pl-10 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </div>

        {/* Nav icons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Wishlist */}
          <Link
            href="/account/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-surface-600 hover:bg-surface-100 hover:text-brand-600 transition-colors"
            aria-label="Wishlist"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </Link>

          {/* Notifications */}
          <Link
            href="/account/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-surface-600 hover:bg-surface-100 hover:text-brand-600 transition-colors"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-surface-600 hover:bg-surface-100 hover:text-brand-600 transition-colors"
            aria-label="Cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </Link>

          {/* Account Menu */}
          {isPending ? (
            <div className="h-10 w-10 rounded-full bg-surface-100 animate-pulse"></div>
          ) : session ? (
            <div className="relative group">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 transition-colors"
                aria-label="User Menu"
              >
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </button>
              
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block border border-surface-100">
                <div className="px-4 py-2 border-b border-surface-100">
                  <p className="text-sm text-surface-900 font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-surface-500 truncate">{session.user.email}</p>
                </div>
                
                {(session.user as any).role === "ADMIN" && (
                  <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-brand-600">
                    Admin Dashboard
                  </Link>
                )}
                
                <Link href="/account" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-brand-600">
                  My Account
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden border-t border-surface-100 px-4 py-2">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-full border border-surface-200 bg-surface-50 py-2 pl-10 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>
    </header>
  );
}
