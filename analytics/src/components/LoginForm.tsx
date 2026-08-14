import { useState } from "react";
import { api } from "@/lib/api";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(116,153,125,0.18),transparent_55%),linear-gradient(180deg,#f8f7f2,#eef2ef)] px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-ink-200/80 bg-white/80 p-8 shadow-[0_20px_60px_-30px_rgba(35,54,42,0.45)] backdrop-blur"
      >
        <p className="font-display text-3xl text-ink-900">Analytics</p>
        <p className="mt-2 text-sm text-ink-500">
          Private dashboard for sam-loiterstein.com
        </p>
        <label className="mt-8 block text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
          Password
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-ink-200 bg-cream/50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-sage-500"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full bg-sage-700 px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-sage-800 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
