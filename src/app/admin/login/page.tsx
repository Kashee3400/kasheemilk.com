import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminUser } from "@/lib/admin/auth";

export default function AdminLoginPage() {
  if (getAdminUser()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8f7] px-4 py-10">
      <LoginForm />
    </main>
  );
}
