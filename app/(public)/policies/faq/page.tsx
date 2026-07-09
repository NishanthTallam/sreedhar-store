import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "FAQ | Sreedhar Store",
  description: "Frequently Asked Questions at Sreedhar Store",
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">FAQ</span>
      </nav>

      <div className="prose prose-neutral max-w-none rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-sm text-neutral-500 mb-8 pb-8 border-b border-neutral-100">Last Updated: October 2023</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Q. What are your delivery hours?</h3>
            <p className="text-neutral-700 leading-relaxed">A. We deliver from 9:00 AM to 8:00 PM, Monday to Saturday. Sunday timings may vary.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Q. How can I pay for my order?</h3>
            <p className="text-neutral-700 leading-relaxed">A. We currently accept Cash on Delivery (COD). We are actively working on integrating online payment gateways like UPI, Credit/Debit cards, and Net Banking.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Q. Do you charge for delivery?</h3>
            <p className="text-neutral-700 leading-relaxed">A. We offer free delivery on all orders above ₹500. Orders below ₹500 incur a standard flat rate delivery charge of ₹50.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Q. How do I return an item?</h3>
            <p className="text-neutral-700 leading-relaxed">A. You can request a return from the "My Orders" section in your account within 3 days of delivery. Please review our Return Policy for eligible items.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Q. Where is your physical store located?</h3>
            <p className="text-neutral-700 leading-relaxed">A. We are located in Bukkapatnam, Puttaparthi, Andhra Pradesh. We serve the local community through both our physical store and this online platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
