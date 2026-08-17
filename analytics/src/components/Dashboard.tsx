import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { DailySection } from "@/components/DailySection";
import { LocationMap } from "@/components/LocationMap";
import { TrackingLinksPanel } from "@/components/TrackingLinksPanel";
import { RankedList, Stat } from "@/components/Widgets";

type NamedCount = { name: string; count: number };

type DayRow = {
  day: string;
  sessions: number;
  visitors: number;
};

type SourceStat = {
  name: string;
  slug: string;
  count: number;
};

type DashboardData = {
  range?: string;
  visitors: number;
  sessions: number;
  pageviews: number;
  repeat_visitors: number;
  new_visitors: number;
  sections: NamedCount[];
  top_clicks: NamedCount[];
  countries: NamedCount[];
  cities: NamedCount[];
  referrers: NamedCount[];
  devices: NamedCount[];
  daily: DayRow[];
  sources?: SourceStat[];
};

type Preset = "7" | "30" | "90" | "all" | "custom";
type View = "overview" | "links";

const SECTION_LABELS: Record<string, string> = {
  top: "Hero",
  approach: "Approach",
  work: "Systems",
  writing: "Writing",
  media: "Press",
  background: "Background",
  engagements: "Engagements",
  contact: "Contact",
};

function labelSection(name: string) {
  return SECTION_LABELS[name] || name;
}

function labelClick(name: string) {
  return name
    .replace(/^cta:/, "CTA · ")
    .replace(/^nav:/, "Nav · ")
    .replace(/^nav-mobile:/, "Mobile nav · ")
    .replace(/^contact:/, "Contact · ")
    .replace(/^demo:/, "Demo · ")
    .replace(/^form:/, "Form · ")
    .replace(/^link:/, "Link · ")
    .replace(/^button:/, "Button · ");
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoUtc(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("overview");
  const [preset, setPreset] = useState<Preset>("30");
  const [customFrom, setCustomFrom] = useState(daysAgoUtc(29));
  const [customTo, setCustomTo] = useState(todayUtc());
  const [appliedCustom, setAppliedCustom] = useState({
    from: daysAgoUtc(29),
    to: todayUtc(),
  });
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    if (preset === "custom") {
      return `range=custom&from=${encodeURIComponent(appliedCustom.from)}&to=${encodeURIComponent(appliedCustom.to)}`;
    }
    if (preset === "all") return "range=all";
    return `range=${preset}`;
  }, [preset, appliedCustom]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void api<DashboardData & { ok: boolean }>(`/api/dashboard?${query}`)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const sections = useMemo(
    () =>
      (data?.sections || []).map((s) => ({
        ...s,
        name: labelSection(s.name),
      })),
    [data]
  );

  const clicks = useMemo(
    () =>
      (data?.top_clicks || []).map((c) => ({
        ...c,
        name: labelClick(c.name),
      })),
    [data]
  );

  const presets: { id: Preset; label: string }[] = [
    { id: "7", label: "7 days" },
    { id: "30", label: "30 days" },
    { id: "90", label: "90 days" },
    { id: "all", label: "All time" },
    { id: "custom", label: "Custom" },
  ];

  const views: { id: View; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "links", label: "Tracking links" },
  ];

  const sourceStats = useMemo(
    () =>
      (data?.sources || []).map((s) => ({
        name: s.name,
        count: s.count,
      })),
    [data]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(116,153,125,0.14),transparent_45%),linear-gradient(180deg,#f8f7f2,#eef1ee)]">
      <header className="border-b border-ink-200/70 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-ink-900">Analytics</h1>
            <p className="text-sm text-ink-500">sam-loiterstein.com</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="border border-ink-200 px-3 py-1.5 text-sm text-ink-700 hover:border-sage-500"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 pb-4">
          <div className="flex gap-1">
            {views.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`px-3 py-1.5 text-sm transition ${
                  view === tab.id
                    ? "bg-ink-900 text-cream"
                    : "border border-ink-200 text-ink-700 hover:border-sage-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {view === "overview" && (
            <div className="flex flex-wrap gap-1">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id)}
                  className={`px-3 py-1.5 text-sm transition ${
                    preset === p.id
                      ? "bg-sage-700 text-cream"
                      : "border border-ink-200 text-ink-700 hover:border-sage-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {view === "overview" && preset === "custom" && (
          <div className="mx-auto flex max-w-6xl flex-wrap items-end gap-3 px-6 pb-4">
            <label className="text-xs uppercase tracking-[0.14em] text-ink-500">
              From
              <input
                type="date"
                value={customFrom}
                max={customTo}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="mt-1 block border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-800"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.14em] text-ink-500">
              To
              <input
                type="date"
                value={customTo}
                min={customFrom}
                max={todayUtc()}
                onChange={(e) => setCustomTo(e.target.value)}
                className="mt-1 block border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-800"
              />
            </label>
            <button
              type="button"
              onClick={() => setAppliedCustom({ from: customFrom, to: customTo })}
              className="bg-sage-700 px-4 py-1.5 text-sm text-cream hover:bg-sage-800"
            >
              Apply range
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {error && (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
            {error.toLowerCase().includes("analytics_dashboard") ||
            error.toLowerCase().includes("tracking_links") ||
            error.toLowerCase().includes("function") ||
            error.toLowerCase().includes("could not find") ? (
              <span className="mt-1 block text-red-700">
                Run the latest SQL migrations in Supabase (dashboard v3 + tracking
                links), then refresh.
              </span>
            ) : null}
          </p>
        )}
        {view === "links" && (
          <TrackingLinksPanel stats={data?.sources || []} />
        )}

        {view === "overview" && loading && (
          <p className="text-sm text-ink-500">Loading…</p>
        )}

        {view === "overview" && !loading && data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Stat label="Visitors" value={data.visitors ?? 0} />
              <Stat label="Repeat visitors" value={data.repeat_visitors ?? 0} />
              <Stat label="New visitors" value={data.new_visitors ?? 0} />
              <Stat label="Sessions" value={data.sessions ?? 0} />
              <Stat label="Pageviews" value={data.pageviews ?? 0} />
            </div>

            <DailySection days={data.daily || []} />

            <LocationMap
              countries={data.countries || []}
              cities={data.cities || []}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <RankedList
                title="Visitor sources"
                items={sourceStats}
                empty="No attributed visits yet — create tracking links and share them."
              />
              <RankedList title="Referrers" items={data.referrers || []} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <RankedList
                title="Where people click"
                items={clicks}
                empty="No clicks yet — browse the site to generate some."
              />
              <RankedList
                title="Sections reached"
                items={sections}
                empty="No section views yet."
              />
            </div>

            <RankedList title="Devices" items={data.devices || []} />
          </>
        )}
      </main>
    </div>
  );
}
