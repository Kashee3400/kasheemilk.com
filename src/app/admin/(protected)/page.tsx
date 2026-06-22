import Link from "next/link";
import { ArrowRight, BarChart3, CircleAlert, Inbox, Sparkles } from "lucide-react";
import { getAdminDashboardData } from "@/lib/admin/dashboard";

const toneClasses = {
  green: "bg-primary-50 text-primary-800 border-primary-100",
  gold: "bg-gold-50 text-gold-800 border-gold-100",
  blue: "bg-sky-50 text-sky-800 border-sky-100",
  neutral: "bg-white text-ink-800 border-ink-100",
};

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-700">
            <Sparkles size={14} />
            CMS Control Room
          </p>
          <h1 className="font-body text-2xl font-bold tracking-normal text-ink-900 md:text-3xl">
            Website Management Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            Manage live content, review submissions, and keep the Kashee Milk website fresh from one place.
          </p>
        </div>
        <Link
          href="/admin/hero"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary-800 px-4 text-sm font-bold text-white hover:bg-primary-700"
        >
          Edit hero
          <ArrowRight size={16} />
        </Link>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {data.metrics.map((metric) => (
          <div key={metric.label} className={`rounded-lg border p-4 ${toneClasses[metric.tone]}`}>
            <p className="text-sm font-semibold opacity-80">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold leading-none">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-ink-100 bg-white">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Inbox size={18} className="text-primary-700" />
              <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Recent Contact Messages</h2>
            </div>
            <Link href="/admin/contact" className="text-sm font-bold text-primary-700 hover:text-primary-800">
              View all
            </Link>
          </div>
          <div className="divide-y divide-ink-100">
            {data.recentContacts.length ? data.recentContacts.map((item) => (
              <div key={item.id} className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm font-bold text-ink-900">{item.full_name}</p>
                  <p className="text-xs text-ink-500">{item.email}</p>
                </div>
                <span className="w-fit rounded-md bg-ink-50 px-2 py-1 text-xs font-semibold capitalize text-ink-600">
                  {item.subject.replace("_", " ")} · {item.status}
                </span>
              </div>
            )) : (
              <EmptyState label="No contact messages found yet." />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-ink-100 bg-white">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-700" />
              <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Hiring Pipeline</h2>
            </div>
            <Link href="/admin/careers" className="text-sm font-bold text-primary-700 hover:text-primary-800">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-ink-100">
            {data.recentApplications.length ? data.recentApplications.map((item) => (
              <div key={item.id} className="px-5 py-4">
                <p className="text-sm font-bold text-ink-900">{item.first_name} {item.last_name}</p>
                <p className="text-xs text-ink-500">{item.job_title || "Job application"} · {item.email}</p>
                <span className="mt-2 inline-flex rounded-md bg-gold-50 px-2 py-1 text-xs font-semibold capitalize text-gold-800">
                  {item.status.replace("_", " ")}
                </span>
              </div>
            )) : (
              <EmptyState label="No job applications found yet." />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-8 text-sm font-medium text-ink-500">
      <CircleAlert size={16} />
      {label}
    </div>
  );
}
