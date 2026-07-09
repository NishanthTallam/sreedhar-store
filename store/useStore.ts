import { create } from "zustand";

export interface CartItemType {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    productId: string;
    price: number | string;
    mrpPrice: number | string | null;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  };
}

export interface CartType {
  id: string;
  userId: string;
  items: CartItemType[];
}

export interface WishlistItemType {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    images: string[];
    avgRating?: string | number | null;
  };
}

interface StoreState {
  cartData: CartType | null;
  wishlistData: WishlistItemType[];
  
  setCartData: (cart: CartType | null) => void;
  setWishlistData: (wishlist: WishlistItemType[]) => void;
  
  // Optimistic UI Updaters
  optimisticAddToCart: (item: any) => void;
  optimisticUpdateQuantity: (id: string, quantity: number) => void;
  optimisticRemoveFromCart: (id: string) => void;
  
  optimisticToggleWishlist: (product: any, isWishlisted: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  cartData: null,
  wishlistData: [],
  
  setCartData: (cart) => set({ cartData: cart }),
  setWishlistData: (wishlist) => set({ wishlistData: wishlist }),
  
  optimisticAddToCart: (item) =>
    set((state) => {
      if (!state.cartData) return state; // Handle gracefully if no cart yet, typically query would re-fetch anyway
      const existingItemIndex = state.cartData.items.findIndex(
        (i) => i.variantId === item.variantId
      );
      
      const newItems = [...state.cartData.items];
      if (existingItemIndex > -1) {
        newItems[existingItemIndex].quantity += item.quantity || 1;
      } else {
        newItems.push({
          id: `temp-${Date.now()}`,
          cartId: state.cartData.id,
          variantId: item.variantId,
          quantity: item.quantity || 1,
          variant: item.variant, // Needs to be passed ideally
        } as CartItemType);
      }
      
      return { cartData: { ...state.cartData, items: newItems } };
    }),
    
  optimisticUpdateQuantity: (id, quantity) =>
    set((state) => {
      if (!state.cartData) return state;
      return {
        cartData: {
          ...state.cartData,
          items: state.cartData.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        },
      };
    }),
    
  optimisticRemoveFromCart: (id) =>
    set((state) => {
      if (!state.cartData) return state;
      return {
        cartData: {
          ...state.cartData,
          items: state.cartData.items.filter((i) => i.id !== id),
        },
      };
    }),
    
  optimisticToggleWishlist: (product, isWishlisted) =>
    set((state) => {
      if (isWishlisted) {
        return {
          wishlistData: state.wishlistData.filter((i) => i.productId !== product.id),
        };
      } else {
        return {
          wishlistData: [
            ...state.wishlistData,
            {
              id: `temp-${Date.now()}`,
              userId: "temp",
              productId: product.id,
              product,
            },
          ],
        };
      }
    }),
}));
