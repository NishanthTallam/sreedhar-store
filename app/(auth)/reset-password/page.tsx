"use client";

import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(error.message || "Failed to reset password. The link might be expired.");
        setLoading(false);
        return;
      }

      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Create new password
        </h2>
        <p className="text-sm text-neutral-500">
          Or{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
            return to sign in
          </Link>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Password</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <LockClosedIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-neutral-300 bg-white text-neutral-900 pl-11 pr-11 px-3 py-2.5 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 focus:outline-none rounded-md hover:bg-neutral-100 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm New Password</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <LockClosedIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg border border-neutral-300 bg-white text-neutral-900 pl-11 pr-11 px-3 py-2.5 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              placeholder="••••••••"
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
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <svg className="animate-spin h-6 w-6 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}