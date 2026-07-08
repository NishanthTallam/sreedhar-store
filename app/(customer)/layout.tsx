// app/(customer)/layout.tsx
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import CustomerSidebar from "@/components/layout/CustomerSidebar";

export const dynamic = "force-dynamic";
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-16 w-full border-b bg-white" />}>
        <Header />
      </Suspense>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <CustomerSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
