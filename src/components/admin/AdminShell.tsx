"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BriefcaseBusiness, Contact, FileText, Flag, GalleryHorizontalEnd, Chrome as Home, Images, LayoutDashboard, LogOut, Megaphone, Navigation, PanelLeft, Settings, ShieldCheck, UsersRound } from "lucide-react";
import type { AdminUser } from "@/lib/admin/auth";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/", label: "View Website", icon: Home },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/hero", label: "Hero Slider", icon: GalleryHorizontalEnd },
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/site-content", label: "Site Content", icon: Settings },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/board", label: "Board", icon: UsersRound },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/careers", label: "Careers", icon: BriefcaseBusiness },
      { href: "/admin/contact", label: "Contact CRM", icon: Contact },
    ],
  },
  {
    label: "Structure",
    items: [
      { href: "/admin/navigation", label: "Navigation", icon: Navigation },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/flags", label: "Feature Flags", icon: Flag },
    ],
  },
];

type Props = {
  children: React.ReactNode;
  user: AdminUser;
};

export default function AdminShell({ children, user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f8f7] text-ink-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ink-100 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-ink-100 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-800 text-white">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">Kashee Admin</p>
            <p className="truncate text-xs font-medium text-ink-500">Content Management</p>
          </div>
        </div>

        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === "/"
                    ? false
                    : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                        active
                          ? "bg-primary-50 text-primary-800"
                          : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                      ].join(" ")}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-100 text-ink-600 lg:hidden">
              <PanelLeft size={19} />
            </button>
            <div>
              <p className="text-sm font-bold text-ink-900">Admin Portal</p>
              <p className="text-xs text-ink-500">Manage the live Kashee Milk website</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink-800">{user.name}</p>
              <p className="text-xs text-ink-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex h-10 items-center gap-2 rounded-md border border-ink-100 bg-white px-3 text-sm font-semibold text-ink-600 hover:border-primary-200 hover:text-primary-700"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
