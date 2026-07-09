import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Cancellation Policy | Sreedhar Store",
  description: "Cancellation Policy of Sreedhar Store",
};

export default function CancellationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">Cancellation Policy</span>
      </nav>

      <div className="prose prose-neutral max-w-none rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Cancellation Policy</h1>
        <p className="text-sm text-neutral-500 mb-8 pb-8 border-b border-neutral-100">Last Updated: October 2023</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Order Cancellation by Customer</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">You may cancel your order at any time before it is marked as "Out for Delivery". To cancel an order, navigate to "My Orders" in your account dashboard, select the order, and click the "Cancel Order" button. If the order is successfully canceled, any payments made will be fully refunded to the original payment method within 3-5 business days.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Order Cancellation by Store</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">Sreedhar Store reserves the right to cancel any order under certain circumstances. This includes, but is not limited to, inventory unavailability, pricing errors, or suspicion of fraudulent activity. In such cases, we will notify you immediately and process a full refund.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">Late Cancellations</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">Orders that have already been dispatched (marked "Out for Delivery") cannot be canceled through the portal. However, you may refuse the delivery at the door. Please note that frequent door refusals may result in restricted account privileges.</p>
      </div>
    </div>
  );
}
