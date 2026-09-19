"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Lock, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-xl">
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <label className="label" htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <label className="label mt-4" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="mt-4 rounded-md bg-steel-50 p-3 text-center text-xs text-steel-500">
        Demo login — see the README. Default: admin@revisionzero.local / admin123
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-steel-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-500 font-display text-lg font-extrabold text-white">
            R0
          </span>
          <h1 className="mt-4 text-xl font-bold text-white">Admin sign in</h1>
          <p className="text-sm text-steel-400">Revision Zero content management</p>
        </div>

        <Suspense fallback={<div className="rounded-2xl bg-white p-6 text-center text-sm text-steel-400 shadow-xl">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
