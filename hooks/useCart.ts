import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, removeFromCart, updateCartQuantity, moveFromWishlist } from "@/lib/api/cart";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/useToast";

export function useCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setCartData, optimisticAddToCart, optimisticRemoveFromCart, optimisticUpdateQuantity } = useStore();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await getCart();
      setCartData(data);
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (variables: { variantId: string; quantity?: number; variant?: any }) =>
      addToCart(variables.variantId, variables.quantity),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      
      optimisticAddToCart({
        variantId: variables.variantId,
        quantity: variables.quantity || 1,
        variant: variables.variant,
      });

      return { previousCart };
    },
    onError: (err, newCart, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      if (context?.previousCart) {
        setCartData(context.previousCart as any);
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "danger",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Added to Cart",
        variant: "success",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFromCart(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      
      optimisticRemoveFromCart(id);

      return { previousCart };
    },
    onError: (err, newCart, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      if (context?.previousCart) {
        setCartData(context.previousCart as any);
      }
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "danger",
      });
    },
    onSuccess: () => {
      toast({
        title: "Removed",
        description: "Item removed from cart",
        variant: "default",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateCartQuantity(id, quantity),
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      
      optimisticUpdateQuantity(id, quantity);

      return { previousCart };
    },
    onError: (err, newCart, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      if (context?.previousCart) {
        setCartData(context.previousCart as any);
      }
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "danger",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const moveFromWishlistMutation = useMutation({
    mutationFn: ({ variantId, productId, variant, product }: { variantId: string; productId: string; variant?: any; product?: any }) =>
      moveFromWishlist(variantId, productId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      
      const previousCart = queryClient.getQueryData(["cart"]);
      const previousWishlist = queryClient.getQueryData(["wishlist"]);
      
      // Optimistically add to cart
      optimisticAddToCart({
        variantId: variables.variantId,
        quantity: 1,
        variant: variables.variant,
      });

      // Optimistically remove from wishlist
      if (variables.product) {
        useStore.getState().optimisticToggleWishlist(variables.product, true);
      }

      return { previousCart, previousWishlist };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      
      if (context?.previousCart) {
        setCartData(context.previousCart as any);
      }
      if (context?.previousWishlist) {
        useStore.getState().setWishlistData(context.previousWishlist as any);
      }
      
      toast({
        title: "Error",
        description: "Failed to move item to cart.",
        variant: "danger",
      });
    },
    onSuccess: () => {
      toast({
        title: "Moved",
        description: "Item moved to Cart",
        variant: "success",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return {
    cartData: query.data,
    isLoading: query.isLoading,
    refreshCart: query.refetch,
    addToCart: addMutation.mutate,
    removeFromCart: removeMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    moveFromWishlist: moveFromWishlistMutation.mutate,
    isAdding: addMutation.isPending || moveFromWishlistMutation.isPending,
    isRemoving: removeMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
  };
}
