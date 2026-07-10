"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCart } from "@/hooks/useCart";

// Lazy load the heavy map component (leaflet/Google Maps)
const AddressMapPicker = dynamic(
  () => import("@/components/maps/AddressMapPicker").then(mod => mod.AddressMapPicker),
  { 
    ssr: false, 
    loading: () => <div className="h-64 w-full rounded-lg bg-neutral-100 animate-pulse flex items-center justify-center text-neutral-400">Loading map...</div> 
  }
);

export default function CheckoutPage() {
  const router = useRouter();
  const { cartData: cart, isLoading: isCartLoading } = useCart();
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout/init");
      if (res.ok) {
        const json = await res.json();
        setProfile(json.data.user);
        setAddresses(json.data.addresses);
        if (json.data.addresses.length > 0) {
          // Default to the first address since they are ordered by isDefault DESC
          setSelectedAddressId(json.data.addresses[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isCartLoading && (!cart || !cart.items || cart.items.length === 0)) {
      router.push("/cart");
    }
  }, [cart, isCartLoading, router]);

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

  const handleAddressSelect = async (addressData: any) => {
    setIsSavingAddress(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile?.name || "Customer",
          mobile: profile?.phone || "0000000000",
          houseNo: "",
          street: addressData.street || addressData.formattedAddress,
          city: addressData.city || "Bukkapatnam",
          state: addressData.state || "Andhra Pradesh",
          pincode: addressData.pincode || "515144",
          latitude: addressData.latitude,
          longitude: addressData.longitude,
          type: "HOME"
        })
      });
      
      const json = await res.json();
      if (res.ok) {
        // Refresh addresses
        fetchCheckoutData();
        // The newly added address will be selected since it's the most recent (handled in fetch or we can manually select it if we sort them, but let's just refetch)
      } else {
        alert(json.error || "Failed to save address");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  if (isLoading || isCartLoading || !cart) {
    return <div className="p-16 text-center text-neutral-500">Loading checkout...</div>;
  }

  const subtotal = cart.items.reduce((acc: number, item: any) => acc + (Number(item.variant.price) * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 50; 
  
  // Real coupon calculation
  let discount = 0;
  if (cart.coupon) {
    if (cart.coupon.type === "FLAT") {
      discount = Number(cart.coupon.value);
    } else if (cart.coupon.type === "PERCENTAGE") {
      discount = subtotal * (Number(cart.coupon.value) / 100);
      if (cart.coupon.maxDiscount && discount > Number(cart.coupon.maxDiscount)) {
        discount = Number(cart.coupon.maxDiscount);
      }
    }
    // Discount cannot exceed subtotal
    discount = Math.min(discount, subtotal);
  }
  const total = subtotal + deliveryCharge - discount;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          
          {/* Customer Profile Section */}
          {profile && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">Customer Profile</h2>
              <div className="text-sm text-neutral-700">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
              </div>
            </section>
          )}

          {/* Address Section */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">Delivery Address</h2>
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 p-6 text-center">
                  <p className="text-neutral-500 mb-4">No address found</p>
                  <button className="inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                    + Add Address
                  </button>
                </div>
              ) : (
                addresses.map((addr) => (
                  <label key={addr.id} className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors ${selectedAddressId === addr.id ? 'border-brand-500 bg-brand-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                    <input
                      type="radio"
                      name="address"
                      className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <div>
                      <p className="font-medium text-neutral-900">
                        {addr.fullName} 
                        <span className="ml-2 inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">{addr.type}</span>
                        {addr.isDefault && <span className="ml-2 inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800">Default</span>}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">{addr.houseNo}, {addr.street}</p>
                      {addr.landmark && <p className="text-sm text-neutral-500">Landmark: {addr.landmark}</p>}
                      <p className="text-sm text-neutral-500">{addr.city}, {addr.state} {addr.pincode}</p>
                      <p className="text-sm text-neutral-500 mt-1">Mobile: {addr.mobile}</p>
                    </div>
                  </label>
                ))
              )}
              
              {addresses.length >= 0 && (
                <div className="pt-4 border-t border-neutral-100 mt-4">
                  <p className="text-sm font-medium text-neutral-900 mb-2">
                    {isSavingAddress ? "Saving address..." : "Or add a new address via map:"}
                  </p>
                  <AddressMapPicker onAddressSelect={handleAddressSelect} />
                </div>
              )}
            </div>
          </section>

          {/* Payment Section */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">Payment Method</h2>
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
                  <p className="font-medium text-neutral-900">Cash on Delivery (COD)</p>
                  <p className="mt-1 text-sm text-neutral-500">Pay at your doorstep.</p>
                </div>
              </label>
            </div>
          </section>

        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Final Order Summary</h2>
            
            <div className="mb-6 space-y-3">
              {cart.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600">{item.quantity}x {item.variant.product.name}</span>
                  <span className="font-medium text-neutral-900">₹{(Number(item.variant.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <dl className="space-y-4 text-sm text-neutral-600 border-t border-neutral-200 pt-4">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-neutral-900">₹{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery Charge</dt>
                <dd className="font-medium text-neutral-900">
                  {deliveryCharge === 0 ? <span className="text-green-600 uppercase">Free</span> : `₹${deliveryCharge.toFixed(2)}`}
                </dd>
              </div>
              {cart.coupon && (
                <div className="flex justify-between text-green-600">
                  <dt>Discount ({cart.coupon.code})</dt>
                  <dd className="font-medium">-₹{discount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200 pt-4 text-xl font-bold text-neutral-900">
                <dt>Total</dt>
                <dd>₹{total.toFixed(2)}</dd>
              </div>
            </dl>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="mt-6 w-full rounded-xl bg-brand-600 py-4 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              {placingOrder ? "Placing Order..." : "Confirm & Place Order"}
            </button>
            <p className="mt-4 text-center text-xs text-neutral-500">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}