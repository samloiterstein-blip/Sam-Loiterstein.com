import { useCallback, useEffect, useMemo, useState } from "react";
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

function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function TrackingLinksPanel({ stats }: { stats: SourceStat[] }) {
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ ok: boolean; links: TrackingLink[] }>("/api/sources");
      setLinks(res.links || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load links";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  const statBySlug = useMemo(
    () => new Map(stats.map((s) => [s.slug, s.count])),
    [stats]
  );

  const onNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) {
      setSlug(slugFromName(value));
    }
  };

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
      setSlugTouched(false);
      await loadLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (linkSlug: string) => {
    if (!window.confirm(`Delete tracking link "${linkSlug}"? Past session data will stay, but the link will stop working.`)) {
      return;
    }
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

  const needsMigration =
    error != null &&
    (error.toLowerCase().includes("tracking_links") ||
      error.toLowerCase().includes("analytics_list_tracking_links") ||
      error.toLowerCase().includes("could not find"));

  return (
    <div className="space-y-6">
      <section className="border border-ink-200/70 bg-white/70 p-5">
        <h2 className="font-display text-xl text-ink-900">Tracking links</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          Create named links for LinkedIn, your email signature, or anywhere else
          you share your site. Each link redirects to your homepage and records
          where that visitor came from.
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Example:{" "}
          <code className="bg-cream px-1.5 py-0.5 text-ink-700">
            {trackingUrl("linkedin")}
          </code>
        </p>
      </section>

      {error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
          {needsMigration ? (
            <span className="mt-1 block text-red-700">
              Run the tracking links SQL migration in Supabase, then refresh.
            </span>
          ) : null}
        </p>
      )}

      <section className="border border-ink-200/70 bg-white/70 p-5">
        <h3 className="text-sm font-medium text-ink-900">Create a new link</h3>
        <form
          onSubmit={onCreate}
          className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <label className="text-xs uppercase tracking-[0.14em] text-ink-500">
            Display name
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="LinkedIn profile"
              className="mt-1 block w-full border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.14em] text-ink-500">
            URL slug
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase());
              }}
              placeholder="linkedin"
              className="mt-1 block w-full border border-ink-200 bg-white px-3 py-2 font-mono text-sm text-ink-800"
            />
          </label>
          <button
            type="submit"
            disabled={saving || !name.trim() || !slug.trim()}
            className="self-end bg-sage-700 px-5 py-2 text-sm text-cream hover:bg-sage-800 disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create link"}
          </button>
        </form>
      </section>

      <section className="border border-ink-200/70 bg-white/70 p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-medium text-ink-900">Your links</h3>
          {!loading && links.length > 0 && (
            <span className="text-xs text-ink-500">{links.length} link{links.length === 1 ? "" : "s"}</span>
          )}
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-ink-500">Loading links…</p>
        ) : links.length === 0 ? (
          <p className="mt-4 text-sm text-ink-500">
            No links yet. Create one above, or run the Supabase migration to seed
            LinkedIn, email, and website links.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200/70 text-xs uppercase tracking-[0.14em] text-ink-500">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Share URL</th>
                  <th className="pb-3 pr-4 font-medium text-right">Sessions</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/50">
                {links.map((link) => {
                  const url = trackingUrl(link.slug);
                  const visits = statBySlug.get(link.slug) ?? 0;
                  return (
                    <tr key={link.slug} className="align-middle">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-ink-900">{link.name}</div>
                        <div className="mt-0.5 font-mono text-xs text-ink-400">/{link.slug}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={url}
                            onFocus={(e) => e.currentTarget.select()}
                            className="min-w-0 flex-1 border border-ink-200 bg-cream/60 px-2 py-1.5 font-mono text-xs text-ink-700"
                          />
                          <button
                            type="button"
                            onClick={() => void copyUrl(link.slug)}
                            className="shrink-0 border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 hover:border-sage-500"
                          >
                            {copied === link.slug ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums text-ink-600">
                        {visits}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void onDelete(link.slug)}
                          className="text-xs text-ink-400 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {stats.length > 0 && (
        <section className="border border-ink-200/70 bg-white/70 p-5">
          <h3 className="text-sm font-medium text-ink-900">Sessions by source</h3>
          <p className="mt-1 text-xs text-ink-500">For the date range selected on Overview.</p>
          <ul className="mt-4 space-y-2">
            {stats.map((item) => (
              <li
                key={item.slug || item.name}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-ink-700">{item.name}</span>
                <span className="shrink-0 tabular-nums text-ink-500">
                  {item.count} session{item.count === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
