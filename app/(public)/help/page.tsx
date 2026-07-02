import Link from "next/link";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our products, adding them to your cart, and proceeding to checkout. You will need to create an account to finalize your order."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Currently, we accept Cash on Delivery (COD). We are working on adding online payment options soon."
    },
    {
      question: "How can I track my order?",
      answer: "Once logged in, go to 'My Account' > 'Orders' to view the real-time status of your orders."
    },
    {
      question: "Can I return a product?",
      answer: "Yes, you can initiate a return request from the Orders page within the specified return window (usually 2-3 days after delivery), provided the item is marked as returnable."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-surface-900">Help & Support</h1>
        <p className="text-lg text-surface-500">We're here to help you with any questions or issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-surface-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-xl border border-surface-200 bg-white shadow-sm">
                <h3 className="font-semibold text-surface-900">{faq.question}</h3>
                <p className="text-surface-600 mt-2 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-surface-900">Contact Us</h2>
          
          <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <PhoneIcon className="w-6 h-6 text-brand-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-surface-900">Phone & WhatsApp</h4>
                <p className="text-surface-600 text-sm mt-1">+1 (555) 123-4567</p>
                <p className="text-surface-400 text-xs mt-0.5">Mon-Sat, 9AM to 6PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <EnvelopeIcon className="w-6 h-6 text-brand-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-surface-900">Email</h4>
                <p className="text-surface-600 text-sm mt-1">support@generalstore.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPinIcon className="w-6 h-6 text-brand-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-surface-900">Store Location</h4>
                <p className="text-surface-600 text-sm mt-1">123 Commerce St, Retail Block<br />Cityville, ST 12345</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 text-center">
            <p className="text-surface-700 text-sm">Need help with a specific order?</p>
            <Link href="/account/orders" className="inline-block mt-2 px-4 py-2 bg-white border border-surface-300 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-50">
              Go to My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}