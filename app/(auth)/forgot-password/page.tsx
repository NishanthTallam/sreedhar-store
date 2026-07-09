"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error } = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
      });

      if (error) {
        setError(error.message || "Failed to send reset link.");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Reset your password
        </h2>
        <p className="text-sm text-neutral-500">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {success ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-3">Check your email</h3>
          <p className="text-neutral-500 leading-relaxed mb-8">
            If an account exists with <span className="font-semibold text-neutral-900">{email}</span>, we have sent a password reset link.
          </p>
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg bg-brand-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <EnvelopeIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-neutral-300 bg-white text-neutral-900 pl-11 px-3 py-2.5 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-brand-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending link...
              </span>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
