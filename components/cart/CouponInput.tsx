"use client";

import { useState } from "react";

interface CouponInputProps {
  onApply: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  appliedCoupon?: string | null;
  onRemove: () => void;
}

export default function CouponInput({ onApply, appliedCoupon, onRemove }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    setFeedback(null);
    try {
      const res = await onApply(code);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: "Failed to apply coupon." });
    } finally {
      setLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-green-800">Code <span className="font-bold">{appliedCoupon}</span> applied</span>
          </div>
          <button onClick={onRemove} className="text-sm font-medium text-red-600 hover:underline">
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 rounded-lg border border-surface-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="rounded-lg bg-surface-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-800 disabled:bg-surface-300"
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      </form>
      {feedback && (
        <p className={`mt-2 text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {feedback.message}
        </p>
      )}
    </div>
  );
}
