"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";
import { Button } from "../ui/Button";

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden -ml-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-neutral-900">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
              A
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
