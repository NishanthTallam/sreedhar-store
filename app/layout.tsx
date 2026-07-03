import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "General Store — Fresh Groceries Delivered Locally",
    template: "%s | General Store",
  },
  description:
    "Order fresh groceries, household essentials, and daily needs online. Fast local delivery with cash on delivery. Browse by category, apply coupons, and track your orders.",
  keywords: [
    "general store",
    "grocery delivery",
    "local delivery",
    "fresh groceries",
    "online store",
    "cash on delivery",
  ],
};

import { BottomTabBar } from "@/components/layout/BottomTabBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <BottomTabBar />
      </body>
    </html>
  );
}
