"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { usePusher } from "@/hooks/usePusher";

interface CartContextType {
  cartCount: number;
  cartData: any;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cartData, setCartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    if (!session) {
      setCartData(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const json = await res.json();
        setCartData(json.data);
      } else {
        setCartData(null);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Real-time synchronization
  usePusher(
    session ? `private-user-${session.user.id}` : "",
    "cart_updated",
    () => {
      refreshCart();
    }
  );

  const cartCount = cartData?.items?.length || 0;

  return (
    <CartContext.Provider value={{ cartCount, cartData, refreshCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
