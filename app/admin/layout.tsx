import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminShell } from "@/components/admin-shell";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell sidebar={<AdminSidebar />}>{children}</AdminShell>;
}
