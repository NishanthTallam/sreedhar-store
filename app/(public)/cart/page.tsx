"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CartItemCard from "@/components/cart/CartItemCard";
import { CouponInput } from "@/components/cart/CouponInput";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/components/providers/WishlistProvider";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { refreshWishlist } = useWishlist();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const json = await res.json();
        setCart(json.data);
      } else {
        // If 401, cart might be empty or user not logged in
        setCart(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: newQuantity })
    });
    fetchCart();
  };

  const handleRemoveItem = async (id: string) => {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    fetchCart();
  };

  const handleApplyCoupon = async (code: string) => {
    const res = await fetch("/api/coupons/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const json = await res.json();
    if (res.ok) fetchCart();
    return json;
  };

  const handleMoveToWishlist = async (id: string, productId: string) => {
    // Add to wishlist
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
    if (res.ok) {
      await refreshWishlist();
    }
    // Remove from cart
    await handleRemoveItem(id);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-neutral-500">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Your Cart is Empty</h1>
        <p className="text-neutral-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="inline-flex rounded-xl bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc: number, item: any) => acc + (Number(item.variant.price) * item.quantity), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Items ({cart.items.length})</h2>
            <div className="flex flex-col">
              {cart.items.map((item: any) => (
                <CartItemCard
                  key={item.id}
                  item={{
                    id: item.id,
                    productId: item.variant.product.id,
                    productName: item.variant.product.name,
                    variantLabel: item.variant.label,
                    price: Number(item.variant.price),
                    quantity: item.quantity,
                    imageUrl: item.variant.product.images?.[0]
                  }}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onMoveToWishlist={handleMoveToWishlist}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Order Summary</h2>
            
            <div className="mb-6 border-b border-neutral-200 pb-6">
              <CouponInput 
                onApply={handleApplyCoupon} 
                appliedCoupon={cart.coupon?.code}
                onRemove={() => handleApplyCoupon("")}
              />
            </div>

            <dl className="space-y-4 text-sm text-neutral-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-neutral-900">₹{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery Charge</dt>
                <dd className="font-medium text-neutral-900">Calculated at checkout</dd>
              </div>
              {cart.coupon && (
                <div className="flex justify-between text-green-600">
                  <dt>Discount ({cart.coupon.code})</dt>
                  <dd className="font-medium">- Applied at checkout</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200 pt-4 text-base font-bold text-neutral-900">
                <dt>Total (Estimated)</dt>
                <dd>₹{subtotal.toFixed(2)}</dd>
              </div>
            </dl>

            <button
              onClick={() => router.push('/checkout')}
              className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}