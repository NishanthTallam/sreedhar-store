import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | Sreedhar Store",
  description: "Shipping Policy of Sreedhar Store",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">Shipping Policy</span>
      </nav>

      <div className="prose prose-neutral max-w-none rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Shipping Policy</h1>
        <p className="text-sm text-neutral-500 mb-8 pb-8 border-b border-neutral-100">Last Updated: October 2023</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Delivery Areas</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">Sreedhar Store currently delivers to selected locations in and around Bukkapatnam, Puttaparthi, Andhra Pradesh. We are continually expanding our delivery radius to serve more customers.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Delivery Timings</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">We strive to deliver all orders within 24 to 48 hours of order confirmation. Our delivery partners operate from 9:00 AM to 8:00 PM, Monday through Saturday. Deliveries on Sundays and public holidays may be subject to delays.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Delivery Charges</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">We offer free delivery on all orders above ₹500. A standard delivery fee of ₹50 will be applied to orders below ₹500. This fee is non-refundable in the event of an order cancellation after dispatch.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Tracking Your Order</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">Once your order is dispatched, you will receive an SMS and email notification. You can also track your order status directly from the "My Orders" section in your account dashboard.</p>
      </div>
    </div>
  );
}
