"use client";

import { useState, Suspense } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError(error.message || "Failed to log in. Check your credentials.");
        setLoading(false);
        return;
      }

      const role = (data?.user as any)?.role;
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
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
          Welcome back
        </h2>
        <p className="text-sm text-neutral-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {resetSuccess && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 flex items-start gap-3">
          <span className="text-lg">✅</span>
          <p className="pt-0.5">Password reset successfully! Please sign in with your new password.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleLogin}>
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

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600 cursor-pointer">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-brand-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <svg className="animate-spin h-6 w-6 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}