// app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex w-full bg-white md:bg-neutral-50">
      {/* Left side: Branding / Illustration (Hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-brand-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract shapes for design */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 font-bold text-lg">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Sreedhar Store
            </span>
          </Link>
          
          <div className="max-w-md mt-20">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Premium Quality Products Delivered Fast
            </h1>
            <p className="text-brand-100 text-lg">
              Join thousands of happy customers and discover our wide range of carefully curated products for your everyday needs.
            </p>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-brand-200 text-sm">
            © {new Date().getFullYear()} Sreedhar Store. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo */}
        <div className="w-full max-w-md md:hidden flex justify-start mb-10 mt-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-lg">
              S
            </div>
            <span className="text-2xl font-bold text-neutral-900">
              Sreedhar Store
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white md:rounded-2xl md:border md:border-neutral-200 md:shadow-xl md:shadow-neutral-200/40 p-2 md:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
