import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type TrackingLink = {
  slug: string;
  name: string;
  created_at: string;
};

type SourceStat = {
  name: string;
  slug: string;
  count: number;
};

const SITE_ORIGIN = "https://sam-loiterstein.com";
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$|^[a-z0-9]$/;

function trackingUrl(slug: string) {
  return `${SITE_ORIGIN}/go/${slug}`;
}

export function SourcesSection({ stats }: { stats: SourceStat[] }) {
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ ok: boolean; links: TrackingLink[] }>("/api/sources");
      setLinks(res.links || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();
    if (!trimmedName || !normalizedSlug) return;
    if (!SLUG_RE.test(normalizedSlug)) {
      setError("Slug must use lowercase letters, numbers, and hyphens only.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await api("/api/sources", {
        method: "POST",
        body: JSON.stringify({ name: trimmedName, slug: normalizedSlug }),
      });
      setName("");
      setSlug("");
      await loadLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (linkSlug: string) => {
    if (!window.confirm(`Delete tracking link "${linkSlug}"?`)) return;
    setError(null);
    try {
      await api(`/api/sources?slug=${encodeURIComponent(linkSlug)}`, {
        method: "DELETE",
      });
      await loadLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete link");
    }
  };

  const copyUrl = async (linkSlug: string) => {
    const url = trackingUrl(linkSlug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(linkSlug);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Could not copy to clipboard");
    }
  };

  const statBySlug = new Map(stats.map((s) => [s.slug, s.count]));

  return (
    <section className="border border-ink-200/70 bg-white/70 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-ink-900">Tracking links</h3>
          <p className="mt-1 text-sm text-ink-500">
            Share a named link to see where visitors came from — LinkedIn, email
            signature, etc.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <form
        onSubmit={onCreate}
        className="mt-4 grid gap-3 border border-ink-200/70 bg-cream/40 p-4 sm:grid-cols-[1fr_1fr_auto]"
      >
        <label className="text-xs uppercase tracking-[0.14em] text-ink-500">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Conference flyer"
            className="mt-1 block w-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-800"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.14em] text-ink-500">
          Slug
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="conference-2026"
            className="mt-1 block w-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-800"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="self-end bg-sage-700 px-4 py-1.5 text-sm text-cream hover:bg-sage-800 disabled:opacity-60"
        >
          {saving ? "Creating…" : "Create link"}
        </button>
      </form>

      {loading ? (
        <p className="mt-4 text-sm text-ink-500">Loading links…</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink-200/70 border border-ink-200/70">
          {links.map((link) => {
            const url = trackingUrl(link.slug);
            const visits = statBySlug.get(link.slug) ?? 0;
            return (
              <li
                key={link.slug}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="font-medium text-ink-900">{link.name}</div>
                  <div className="truncate text-sm text-ink-500">{url}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm tabular-nums text-ink-500">
                    {visits} session{visits === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    onClick={() => void copyUrl(link.slug)}
                    className="border border-ink-200 px-3 py-1 text-sm text-ink-700 hover:border-sage-500"
                  >
                    {copied === link.slug ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(link.slug)}
                    className="border border-ink-200 px-3 py-1 text-sm text-ink-500 hover:border-red-300 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {stats.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs uppercase tracking-[0.14em] text-ink-500">
            Sessions by source (selected range)
          </h4>
          <ul className="mt-3 space-y-2">
            {stats.map((item) => (
              <li
                key={item.slug || item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-ink-700">{item.name}</span>
                <span className="tabular-nums text-ink-500">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
