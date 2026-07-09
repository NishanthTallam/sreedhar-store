"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false); 
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name,
        callbackURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      });

      if (error) {
        setError(error.message || "Failed to register. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Create an account
        </h2>
        <p className="text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>

      {success ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-3">Verify your email</h3>
          <p className="text-neutral-500 leading-relaxed mb-8">
            We've sent an email to <span className="font-semibold text-neutral-900">{email}</span>.
            Please click the link in the email to verify your account.
          </p>
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg bg-brand-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <UserIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-neutral-300 bg-white text-neutral-900 pl-11 px-3 py-2.5 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
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
            <p className="mt-2 text-xs text-neutral-500">Must be at least 8 characters long.</p>
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
                Creating account...
              </span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
      )}
    </div>
  );
}