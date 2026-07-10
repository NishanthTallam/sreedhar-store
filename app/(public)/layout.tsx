// app/(public)/layout.tsx
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { prisma } from "@/lib/prisma";
import { cached, CACHE_KEYS } from "@/lib/cache";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await cached(
    CACHE_KEYS.ALL_CATEGORIES,
    () =>
      prisma.category.findMany({
        take: 10,
        orderBy: { products: { _count: "desc" } },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    300 // 5 minutes
  );

  return (
    <>
      <Suspense fallback={<div className="h-16 w-full border-b bg-white" />}>
        <Header />
      </Suspense>
      <CategoryNav categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}