"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { usePusher } from "@/hooks/usePusher";

interface WishlistContextType {
  wishlistCount: number;
  wishlistData: any[];
  refreshWishlist: () => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWishlist = useCallback(async () => {
    if (!session) {
      setWishlistData([]);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const json = await res.json();
        setWishlistData(json.data || []);
      } else {
        setWishlistData([]);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  // Real-time synchronization
  usePusher(
    session ? `private-user-${session.user.id}` : "",
    "wishlist_updated",
    () => {
      refreshWishlist();
    }
  );

  const wishlistCount = wishlistData?.length || 0;

  return (
    <WishlistContext.Provider value={{ wishlistCount, wishlistData, refreshWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
