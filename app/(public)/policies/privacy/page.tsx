import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Sreedhar Store",
  description: "Privacy Policy of Sreedhar Store",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">Privacy Policy</span>
      </nav>

      <div className="prose prose-neutral max-w-none rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mb-8 pb-8 border-b border-neutral-100">Last Updated: October 2023</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">1. Information We Collect</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">At Sreedhar Store, we collect information you provide directly to us when you create an account, place an order, subscribe to our newsletter, or contact customer support. This may include your name, email address, phone number, and delivery address.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">2. How We Use Information</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">We use the information we collect to deliver the products you requested, maintain your account, process payments, and communicate with you about your orders, products, and promotional offers.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">3. Information Sharing</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">We do not sell or share your personal information with third parties for their direct marketing purposes. We may share your information with trusted service providers who assist us in operating our website and fulfilling your orders (e.g., delivery partners).</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">4. Data Security</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">We take reasonable measures, including administrative, technical, and physical safeguards, to protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>
        
        <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-4">5. Contact Us</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">If you have any questions about this Privacy Policy, please contact us at <strong>tallamnishanth@gmail.com</strong> or call us at <strong>+91 7989102722</strong>.</p>
      </div>
    </div>
  );
}
