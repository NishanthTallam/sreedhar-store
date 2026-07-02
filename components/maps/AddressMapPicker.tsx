"use client";

export default function AddressMapPicker() {
  return (
    <div className="w-full flex-col gap-2">
      <div className="h-64 w-full rounded-xl border border-surface-200 bg-surface-50 relative overflow-hidden flex flex-col items-center justify-center">
        <svg className="h-8 w-8 text-surface-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-sm font-medium text-surface-600 text-center px-4">
          Map Picker Placeholder<br/>
          <span className="text-xs text-surface-500 font-normal">Google Maps SDK will be integrated here</span>
        </p>
      </div>
      <button type="button" className="mt-2 w-full rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
        Detect My Location
      </button>
    </div>
  );
}
