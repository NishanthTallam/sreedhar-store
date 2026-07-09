"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    const error = searchParams.get("error");
    if (error) {
      setStatus("error");
      setMessage("Email verification failed. The link may be expired or already used.");
      return;
    }

    setStatus("success");
    setMessage("Your email has been verified successfully! You can now sign in.");

    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [token, searchParams, router]);

  return (
    <div className="w-full text-center py-6">
      {status === "loading" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center mb-6">
            <svg className="animate-spin h-10 w-10 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
            Verifying your email
          </h2>
          <p className="text-sm text-neutral-500">
            Please wait while we confirm your email address.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
            Email Verified!
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            {message}
          </p>
          <div className="text-xs text-neutral-400 mb-6">Redirecting to home in a few seconds...</div>
          <Link
            href="/"
            className="flex w-full justify-center rounded-lg bg-brand-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
          >
            Go to Home
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            {message}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="flex w-full justify-center rounded-lg bg-brand-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
            >
              Go to Login
            </Link>
            <Link
              href="/register"
              className="flex w-full justify-center rounded-lg border border-neutral-300 bg-white py-3 px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
            >
              Register Again
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <svg className="animate-spin h-6 w-6 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}