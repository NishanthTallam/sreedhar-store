// app/(admin)/layout.tsx
import AdminSidebar from "@/components/layout/AdminSidebar";

export const dynamic = "force-dynamic";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />

      {/* Main content area — offset by sidebar width (w-64 = 16rem) */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-md">
          <h1 className="text-lg font-semibold text-neutral-900">
            Admin Panel
          </h1>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
              A
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
