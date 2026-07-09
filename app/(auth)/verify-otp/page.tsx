"use client";

import { useState, useRef, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyOtpContent() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value.slice(-1); // one digit per box
    setOtp(updated);
    // Auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use Better Auth's email OTP verification
      const { data, error } = await (authClient as any).emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (error) {
        setError(error.message || "Invalid or expired OTP. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Verify your identity
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-neutral-900">{email || "your email"}</span>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleVerify}>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* OTP input boxes */}
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg border border-neutral-300 bg-white text-center text-xl font-bold text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-500">
        Didn&apos;t receive the code?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <svg className="animate-spin h-6 w-6 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}