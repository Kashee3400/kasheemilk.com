import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminUser } from "@/lib/admin/auth";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
