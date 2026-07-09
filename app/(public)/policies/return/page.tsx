import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | Sreedhar Store",
  description: "Return & Refund Policy of Sreedhar Store",
};

export default function ReturnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">Return & Refund Policy</span>
      </nav>

      <div className="prose prose-neutral max-w-none rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Return & Refund Policy</h1>
        <p className="text-sm text-neutral-500 mb-8 pb-8 border-b border-neutral-100">Last Updated: October 2023</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Returns</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">We accept returns for eligible items within 3 days of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging. Perishable goods such as fresh fruits, vegetables, and dairy products cannot be returned once accepted.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Refunds</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">Once we receive your returned item, we will inspect it and notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment or store wallet within 5-7 business days.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Damaged or Defective Items</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">If you receive an item that is defective or damaged upon delivery, please contact us immediately at tallamnishanth@gmail.com with photos of the damaged item. We will arrange for a replacement or a full refund.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">How to Initiate a Return</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">To initiate a return, log into your account, navigate to "My Orders", select the relevant order, and click "Request Return". Our delivery agent will pick up the item within 1-2 business days.</p>
      </div>
    </div>
  );
}
