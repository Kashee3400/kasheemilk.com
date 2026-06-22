"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Unable to login." }));
      setError(data.error || "Unable to login.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-ink-100 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-800 text-white">
          <ShieldCheck size={23} />
        </div>
        <div>
          <h1 className="font-body text-xl font-bold tracking-normal text-ink-900">Kashee Admin</h1>
          <p className="text-sm text-ink-500">Sign in to manage website content</p>
        </div>
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-ink-700">Email</span>
        <span className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100">
          <Mail size={17} className="text-ink-400" />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full bg-transparent text-sm outline-none"
            type="email"
            autoComplete="email"
            required
          />
        </span>
      </label>

      <label className="mb-5 block">
        <span className="mb-1.5 block text-sm font-semibold text-ink-700">Password</span>
        <span className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100">
          <LockKeyhole size={17} className="text-ink-400" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full bg-transparent text-sm outline-none"
            type="password"
            autoComplete="current-password"
            required
          />
        </span>
      </label>

      {error ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <button
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-md bg-primary-800 px-4 text-sm font-bold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="mt-4 text-xs leading-5 text-ink-500">
        Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in environment variables before production.
      </p>
    </form>
  );
}
