"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(json => {
        if (json.success) setSettings(json.data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Store Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage global configuration for your storefront.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Store Name</label>
              <input type="text" name="storeName" value={settings?.storeName || ""} onChange={handleChange} required className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Currency</label>
              <select name="currency" value={settings?.currency || "USD"} onChange={handleChange} className="w-full rounded-md border border-neutral-300 p-2 text-sm">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">Store Address</label>
              <input type="text" name="storeAddress" value={settings?.storeAddress || ""} onChange={handleChange} className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Support Email</label>
              <input type="email" name="supportEmail" value={settings?.supportEmail || ""} onChange={handleChange} className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Support Phone</label>
              <input type="text" name="supportPhone" value={settings?.supportPhone || ""} onChange={handleChange} className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">WhatsApp Number</label>
              <input type="text" name="whatsappNumber" value={settings?.whatsappNumber || ""} onChange={handleChange} className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Delivery & Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Flat Delivery Charge</label>
              <input type="number" step="0.01" name="deliveryChargeFlat" value={settings?.deliveryChargeFlat || 0} onChange={handleChange} className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Free Delivery Above</label>
              <input type="number" step="0.01" name="freeDeliveryAbove" value={settings?.freeDeliveryAbove || 0} onChange={handleChange} className="w-full rounded-md border border-neutral-300 p-2 text-sm" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          
          {success && (
            <span className="flex items-center gap-2 text-sm font-medium text-green-600">
              <CheckCircleIcon className="w-5 h-5" />
              Settings updated successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}