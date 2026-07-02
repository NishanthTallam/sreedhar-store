"use client";

import { useState } from "react";
import { NotificationCategory } from "@prisma/client";

export default function SendNotificationPage() {
  const [formData, setFormData] = useState({
    category: "OFFERS" as NotificationCategory,
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      
      if (res.ok) {
        setMessage({ type: "success", text: json.message || "Notification broadcast sent successfully." });
        setFormData({ category: "OFFERS", title: "", body: "" });
      } else {
        setMessage({ type: "error", text: json.error || "Failed to send notification." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Broadcast Notification</h1>
        <p className="text-sm text-surface-500 mt-1">Send a notification to all customers.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700">Category *</label>
            <select 
              required 
              value={formData.category} 
              onChange={e => setFormData({ ...formData, category: e.target.value as NotificationCategory })} 
              className="w-full rounded-md border border-surface-300 p-2 text-sm"
            >
              <option value="OFFERS">Offers / Promotions</option>
              <option value="ACCOUNT">Account Announcements</option>
              <option value="RESTOCK">Restock Alerts</option>
              {/* Note: ORDERS and PAYMENTS are usually triggered by system events, but added if needed */}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700">Title *</label>
            <input 
              required 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              placeholder="e.g. Flash Sale: 50% Off!"
              className="w-full rounded-md border border-surface-300 p-2 text-sm" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700">Message Body *</label>
            <textarea 
              required 
              rows={4}
              value={formData.body} 
              onChange={e => setFormData({ ...formData, body: e.target.value })} 
              placeholder="Enter the notification message..."
              className="w-full rounded-md border border-surface-300 p-2 text-sm resize-none" 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-surface-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Broadcast"}
          </button>
        </div>
      </form>
    </div>
  );
}