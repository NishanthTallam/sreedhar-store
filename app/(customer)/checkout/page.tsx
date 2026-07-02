"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddressMapPicker from "@/components/maps/AddressMapPicker";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    // In a real flow, we fetch user's cart and addresses
    // We stub it here for the UI flow demonstration
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const json = await res.json();
      if (!json.data || json.data.items.length === 0) {
        router.push("/cart"); // Redirect back if empty
      }
      setCart(json.data);
    }
  };

  const fetchAddresses = async () => {
    // Stub addresses. In reality, fetch from API.
    setAddresses([
      { id: "test-addr-1", fullName: "John Doe", type: "HOME", street: "123 Main St, Apartment 4B", city: "Mumbai", state: "MH", pincode: "400001" }
    ]);
    setSelectedAddressId("test-addr-1");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return alert("Please select an address");
    
    setPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod: "COD"
        })
      });
      
      const json = await res.json();
      if (res.ok) {
        alert("Order placed successfully! Check your email for confirmation.");
        router.push(`/account/orders/${json.data.orderId}`);
      } else {
        alert(json.error || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart) {
    return <div className="p-16 text-center text-surface-500">Loading checkout...</div>;
  }

  const subtotal = cart.items.reduce((acc: number, item: any) => acc + (Number(item.variant.price) * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 50; 
  // Simple stub discount calculation for frontend display. Backend is truth.
  const discount = cart.coupon ? (cart.coupon.type === "FLAT" ? Number(cart.coupon.value) : subtotal * (Number(cart.coupon.value) / 100)) : 0;
  const total = subtotal + deliveryCharge - discount;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-surface-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          
          {/* Address Section */}
          <section className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-surface-900">Delivery Address</h2>
            <div className="space-y-4">
              {addresses.map((addr) => (
                <label key={addr.id} className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors ${selectedAddressId === addr.id ? 'border-brand-500 bg-brand-50' : 'border-surface-200 hover:border-surface-300'}`}>
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div>
                    <p className="font-medium text-surface-900">{addr.fullName} <span className="ml-2 inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-800">{addr.type}</span></p>
                    <p className="mt-1 text-sm text-surface-500">{addr.street}</p>
                    <p className="text-sm text-surface-500">{addr.city}, {addr.state} {addr.pincode}</p>
                  </div>
                </label>
              ))}
              
              <div className="pt-4 border-t border-surface-100 mt-4">
                <p className="text-sm font-medium text-surface-900 mb-2">Or add a new address via map:</p>
                <AddressMapPicker />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-surface-900">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex cursor-pointer gap-4 rounded-xl border border-brand-500 bg-brand-50 p-4 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked
                  readOnly
                  className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <p className="font-medium text-surface-900">Cash on Delivery (COD)</p>
                  <p className="mt-1 text-sm text-surface-500">Pay at your doorstep.</p>
                </div>
              </label>
            </div>
          </section>

        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-surface-900">Final Order Summary</h2>
            
            <div className="mb-6 space-y-3">
              {cart.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-surface-600">{item.quantity}x {item.variant.product.name}</span>
                  <span className="font-medium text-surface-900">₹{(Number(item.variant.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <dl className="space-y-4 text-sm text-surface-600 border-t border-surface-200 pt-4">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-surface-900">₹{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery Charge</dt>
                <dd className="font-medium text-surface-900">
                  {deliveryCharge === 0 ? <span className="text-green-600 uppercase">Free</span> : `₹${deliveryCharge.toFixed(2)}`}
                </dd>
              </div>
              {cart.coupon && (
                <div className="flex justify-between text-green-600">
                  <dt>Discount ({cart.coupon.code})</dt>
                  <dd className="font-medium">-₹{discount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-surface-200 pt-4 text-xl font-bold text-surface-900">
                <dt>Total</dt>
                <dd>₹{total.toFixed(2)}</dd>
              </div>
            </dl>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="mt-6 w-full rounded-xl bg-brand-600 py-4 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:bg-surface-300 disabled:cursor-not-allowed"
            >
              {placingOrder ? "Placing Order..." : "Confirm & Place Order"}
            </button>
            <p className="mt-4 text-center text-xs text-surface-500">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}