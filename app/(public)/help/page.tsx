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
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Help & Support</h1>
        <p className="text-lg text-neutral-500">We're here to help you with any questions or issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-xl border border-neutral-200 bg-white shadow-sm">
                <h3 className="font-semibold text-neutral-900">{faq.question}</h3>
                <p className="text-neutral-600 mt-2 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Contact Us</h2>
          
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <PhoneIcon className="w-6 h-6 text-brand-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900">Phone & WhatsApp</h4>
                <p className="text-neutral-600 text-sm mt-1">+91 7989102722</p>
                <p className="text-neutral-400 text-xs mt-0.5">Mon-Sat, 9AM to 6PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <EnvelopeIcon className="w-6 h-6 text-brand-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900">Email</h4>
                <p className="text-neutral-600 text-sm mt-1">tallamnishanth@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPinIcon className="w-6 h-6 text-brand-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900">Store Location</h4>
                <p className="text-neutral-600 text-sm mt-1">123 Commerce St, Retail Block<br />Cityville, ST 12345</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-100 text-center">
            <p className="text-neutral-700 text-sm">Need help with a specific order?</p>
            <Link href="/account/orders" className="inline-block mt-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              Go to My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}