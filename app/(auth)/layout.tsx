// app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-lg">
          G
        </div>
        <span className="text-2xl font-bold tracking-tight text-neutral-900">
          General Store
        </span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} General Store. All rights reserved.
      </p>
    </div>
  );
}
