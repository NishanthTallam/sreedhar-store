// app/(admin)/layout.tsx
import AdminLayoutShell from "@/components/layout/AdminLayoutShell";

export const dynamic = "force-dynamic";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
