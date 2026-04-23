"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          FluentPal
        </Link>

        {sent ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">📬</div>
            <h2 className="mt-4 text-xl font-semibold">Check your inbox</h2>
            <p className="mt-2 text-neutral-600">
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-neutral-500">
              No password needed — we'll email you a link.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-neutral-900 px-4 py-3 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-neutral-400">
              By continuing, you agree to our terms of service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
