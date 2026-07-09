import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWishlist, addToWishlist, removeFromWishlist, moveFromCart } from "@/lib/api/wishlist";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/useToast";

export function useWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setWishlistData, optimisticToggleWishlist } = useStore();

  const query = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const data = await getWishlist();
      setWishlistData(data || []);
      return data || [];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ product, isWishlisted }: { product: any; isWishlisted: boolean }) => {
      if (isWishlisted) {
        return removeFromWishlist(product.id);
      } else {
        return addToWishlist(product.id);
      }
    },
    onMutate: async ({ product, isWishlisted }) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData(["wishlist"]);
      
      optimisticToggleWishlist(product, isWishlisted);

      return { previousWishlist, isWishlisted };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      if (context?.previousWishlist) {
        setWishlistData(context.previousWishlist as any);
      }
      toast({
        title: "Error",
        description: "Failed to update wishlist.",
        variant: "danger",
      });
    },
    onSuccess: (data, variables, context) => {
      if (variables.isWishlisted) {
        toast({
          title: "Removed",
          description: "Removed from Wishlist",
        });
      } else {
        toast({
          title: "Added",
          description: "Added to Wishlist",
          variant: "success",
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const moveFromCartMutation = useMutation({
    mutationFn: ({ cartItemId, productId, variant, product }: { cartItemId: string; productId: string; variant?: any; product?: any }) =>
      moveFromCart(cartItemId, productId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      
      const previousCart = queryClient.getQueryData(["cart"]);
      const previousWishlist = queryClient.getQueryData(["wishlist"]);
      
      // Optimistically remove from cart
      useStore.getState().optimisticRemoveFromCart(variables.cartItemId);

      // Optimistically add to wishlist
      if (variables.product) {
        optimisticToggleWishlist(variables.product, false); // false meaning it is not currently wishlisted
      }

      return { previousCart, previousWishlist };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      
      if (context?.previousCart) {
        useStore.getState().setCartData(context.previousCart as any);
      }
      if (context?.previousWishlist) {
        setWishlistData(context.previousWishlist as any);
      }
      
      toast({
        title: "Error",
        description: "Failed to move item to wishlist.",
        variant: "danger",
      });
    },
    onSuccess: () => {
      toast({
        title: "Moved",
        description: "Item moved to Wishlist",
        variant: "success",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return {
    wishlistData: query.data || [],
    isLoading: query.isLoading,
    refreshWishlist: query.refetch,
    toggleWishlist: toggleMutation.mutate,
    moveFromCart: moveFromCartMutation.mutate,
    isToggling: toggleMutation.isPending || moveFromCartMutation.isPending,
  };
}
