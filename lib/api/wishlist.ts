export const getWishlist = async () => {
  const res = await fetch("/api/wishlist");
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  const data = await res.json();
  return data.data;
};

export const addToWishlist = async (productId: string) => {
  const res = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error("Failed to add to wishlist");
  return res.json();
};

export const removeFromWishlist = async (productId: string) => {
  const res = await fetch("/api/wishlist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error("Failed to remove from wishlist");
  return res.json();
};

export const moveFromCart = async (cartItemId: string, productId: string) => {
  const res = await fetch("/api/wishlist/move-from-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItemId, productId }),
  });
  if (!res.ok) throw new Error("Failed to move from cart");
  return res.json();
};
