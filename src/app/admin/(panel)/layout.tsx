import { requireAdminPage } from "@/server/auth";
import { AdminSidebar } from "@/features/admin/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage();

  return (
    <div className="admin-layout flex">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 min-h-svh lg:ml-64 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
