"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

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

  const refreshCart = async () => {
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
  };

  useEffect(() => {
    refreshCart();
  }, [session]);

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
