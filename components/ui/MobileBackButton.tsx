"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function MobileBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show back button on root pages where it doesn't make sense
  if (pathname === "/" || pathname === "/account" || pathname === "/login") {
    return null;
  }

  return (
    <div className="md:hidden mb-4 -mt-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors bg-white/80 px-3 py-1.5 rounded-lg border border-neutral-200/60 shadow-sm backdrop-blur-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
    </div>
  );
}
