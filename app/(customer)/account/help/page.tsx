"use client";

import { useState } from "react";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function CustomerHelpPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending support request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Help & Support</h1>
        <p className="text-sm text-surface-500 mt-1">Submit a ticket or contact us directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {success ? (
            <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-center">
              <h3 className="text-lg font-bold text-green-800">Request Sent</h3>
              <p className="text-green-700 mt-2">We have received your support request and will get back to you shortly.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-surface-900">Submit a Request</h2>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700">Topic</label>
                <select required className="w-full rounded-md border border-surface-300 p-2 text-sm">
                  <option value="">Select a topic...</option>
                  <option value="order">Where is my order?</option>
                  <option value="return">Return / Refund Issue</option>
                  <option value="account">Account Management</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700">Order ID (Optional)</label>
                <input type="text" placeholder="e.g. ORD-12345" className="w-full rounded-md border border-surface-300 p-2 text-sm" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700">Message</label>
                <textarea required rows={5} placeholder="Describe your issue..." className="w-full rounded-md border border-surface-300 p-2 text-sm resize-none" />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-surface-900">Direct Contact</h3>
            <div className="flex items-start gap-3 text-sm">
              <PhoneIcon className="w-5 h-5 text-brand-600" />
              <div>
                <p className="font-medium text-surface-900">+1 (555) 123-4567</p>
                <p className="text-surface-500">Mon-Sat, 9AM to 6PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <EnvelopeIcon className="w-5 h-5 text-brand-600" />
              <div>
                <p className="font-medium text-surface-900">support@generalstore.com</p>
                <p className="text-surface-500">24/7 Email Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}