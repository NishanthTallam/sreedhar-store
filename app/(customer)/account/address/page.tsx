"use client";

import AddressMapPicker from "@/components/maps/AddressMapPicker";

export default function AccountAddressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900">My Addresses</h1>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stub Address Card */}
        <div className="relative rounded-2xl border border-brand-500 bg-brand-50 p-6 shadow-sm">
          <div className="absolute right-6 top-6 text-brand-600">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-semibold text-brand-900 mb-1 flex items-center gap-2">
            John Doe <span className="rounded-full bg-brand-200/50 px-2 py-0.5 text-xs font-medium text-brand-800">HOME</span>
          </p>
          <p className="text-sm text-brand-700 mt-2">123 Main St, Apartment 4B</p>
          <p className="text-sm text-brand-700">Mumbai, MH 400001</p>
          <p className="text-sm text-brand-700 mt-2">Phone: +91 98765 43210</p>
          
          <div className="mt-4 flex gap-3 text-sm">
            <button className="font-medium text-brand-600 hover:underline">Edit</button>
            <span className="text-brand-300">|</span>
            <button className="font-medium text-red-600 hover:underline">Delete</button>
          </div>
        </div>

        {/* Add new address placeholder */}
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-200 bg-surface-50 p-6 text-center hover:border-brand-300 hover:bg-brand-50 transition-colors cursor-pointer">
          <div className="mb-2 rounded-full bg-white p-3 shadow-sm text-surface-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="font-medium text-surface-900">Add New Address</p>
          <p className="text-sm text-surface-500 mt-1">Deliver to another location</p>
        </div>
      </div>

      {/* Embedded Map Picker Example */}
      <div className="mt-12 rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Location Services</h2>
        <p className="text-sm text-surface-500 mb-6">Drop a pin to ensure accurate delivery.</p>
        <AddressMapPicker />
      </div>
    </div>
  );
}