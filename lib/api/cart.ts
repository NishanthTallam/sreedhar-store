export const getCart = async () => {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  return data.data;
};

export const addToCart = async (variantId: string, quantity: number = 1) => {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variantId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
};

export const updateCartQuantity = async (id: string, quantity: number) => {
  const res = await fetch("/api/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, quantity }),
  });
  if (!res.ok) throw new Error("Failed to update quantity");
  return res.json();
};

export const removeFromCart = async (id: string) => {
  const res = await fetch(`/api/cart?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from cart");
  return res.json();
};

export const moveFromWishlist = async (variantId: string, productId: string) => {
  const res = await fetch("/api/cart/move-from-wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variantId, productId }),
  });
  if (!res.ok) throw new Error("Failed to move from wishlist");
  return res.json();
};
