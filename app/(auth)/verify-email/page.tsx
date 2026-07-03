"use client";

import { useEffect, useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
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

    // Better Auth handles email verification via the /api/auth/verify-email endpoint.
    // The link in the email redirects here automatically after verifying server-side.
    // We just need to show the result based on the URL state.
    const error = searchParams.get("error");
    if (error) {
      setStatus("error");
      setMessage("Email verification failed. The link may be expired or already used.");
      return;
    }

    // If token present and no error — verification was successful (Better Auth verified it)
    setStatus("success");
    setMessage("Your email has been verified successfully! You can now sign in.");

    // Auto-redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [token, searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      {status === "loading" && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4" />
          <h1 className="text-xl font-semibold text-neutral-800">Verifying your email...</h1>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900">Email Verified!</h1>
          <p className="mt-2 text-neutral-500">{message}</p>
          <p className="mt-2 text-sm text-neutral-400">Redirecting to home in 3 seconds...</p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-2.5 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700"
          >
            Go to Home
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900">Verification Failed</h1>
          <p className="mt-2 text-neutral-500">{message}</p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700"
            >
              Go to Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50"
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}