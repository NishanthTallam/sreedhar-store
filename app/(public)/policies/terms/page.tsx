import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Sreedhar Store",
  description: "Terms & Conditions of Sreedhar Store",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">Terms & Conditions</span>
      </nav>

      <div className="prose prose-neutral max-w-none rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Terms & Conditions</h1>
        <p className="text-sm text-neutral-500 mb-8 pb-8 border-b border-neutral-100">Last Updated: October 2023</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">1. Acceptance of Terms</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">By accessing and using Sreedhar Store, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">2. Products and Pricing</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">All products listed on the website are subject to availability. Sreedhar Store reserves the right to modify prices without prior notice. We strive to display accurate product images and descriptions, but we do not guarantee absolute accuracy.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">3. Orders and Cancellation</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">Placing an order constitutes an offer to purchase. We reserve the right to accept or decline your order for any reason, including unavailability of stock or errors in pricing. You may cancel your order before it has been dispatched.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">4. Delivery</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">We deliver to selected areas in and around Bukkapatnam, Puttaparthi. Delivery times are estimates and may vary due to unforeseen circumstances. Sreedhar Store is not liable for any delays beyond our control.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">5. Governing Law</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">These terms shall be governed by and construed in accordance with the laws of India, specifically under the jurisdiction of the courts in Andhra Pradesh.</p>
      </div>
    </div>
  );
}
