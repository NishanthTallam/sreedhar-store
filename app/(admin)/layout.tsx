// app/(admin)/layout.tsx
import AdminLayoutShell from "@/components/layout/AdminLayoutShell";
import { AdminRealtimeListener } from "@/components/realtime/AdminRealtimeListener";

export const dynamic = "force-dynamic";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutShell>
      <AdminRealtimeListener />
      {children}
    </AdminLayoutShell>
  );
}
