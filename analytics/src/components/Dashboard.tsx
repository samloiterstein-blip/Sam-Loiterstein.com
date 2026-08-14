import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { RankedList, Stat } from "@/components/Widgets";

type Overview = {
  visitors: number;
  sessions: number;
  pageviews: number;
  referrers: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  browsers: { name: string; count: number }[];
};

type Engagement = {
  sections: { name: string; count: number }[];
  topClicks: { name: string; count: number }[];
  scrollDepth: { name: string; count: number }[];
};

type Heatmap = {
  path: string;
  points: { x: number; y: number; target: string | null }[];
  paths: { name: string; count: number }[];
};

type SessionRow = {
  id: string;
  started_at: string;
  ua_device: string | null;
  ua_browser: string | null;
  referrer: string | null;
  has_replay: boolean;
};

type Tab = "overview" | "engagement" | "heatmap" | "replays";

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [heatmap, setHeatmap] = useState<Heatmap | null>(null);
  const [heatPath, setHeatPath] = useState("/");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [activeReplay, setActiveReplay] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        if (tab === "overview") {
          const data = await api<Overview & { ok: boolean }>(
            `/api/overview?days=${days}`
          );
          if (!cancelled) setOverview(data);
        } else if (tab === "engagement") {
          const data = await api<Engagement & { ok: boolean }>(
            `/api/engagement?days=${days}`
          );
          if (!cancelled) setEngagement(data);
        } else if (tab === "heatmap") {
          const data = await api<Heatmap & { ok: boolean }>(
            `/api/heatmap?days=${days}&path=${encodeURIComponent(heatPath)}`
          );
          if (!cancelled) setHeatmap(data);
        } else {
          const data = await api<{ ok: boolean; sessions: SessionRow[] }>(
            `/api/sessions?days=${days}&replay=1`
          );
          if (!cancelled) setSessions(data.sessions);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [tab, days, heatPath]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "engagement", label: "Engagement" },
    { id: "heatmap", label: "Heatmap" },
    { id: "replays", label: "Replays" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(116,153,125,0.14),transparent_45%),linear-gradient(180deg,#f8f7f2,#eef1ee)]">
      <header className="border-b border-ink-200/70 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="font-display text-2xl text-ink-900">Analytics</h1>
            <p className="text-sm text-ink-500">sam-loiterstein.com</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="border border-ink-200 bg-white px-3 py-1.5 text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              type="button"
              onClick={onLogout}
              className="border border-ink-200 px-3 py-1.5 text-sm text-ink-700 hover:border-sage-500"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-6 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-sm transition ${
                tab === t.id
                  ? "bg-sage-700 text-cream"
                  : "text-ink-600 hover:bg-sage-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}
        {loading && <p className="text-sm text-ink-500">Loading…</p>}

        {!loading && tab === "overview" && overview && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Visitors" value={overview.visitors} />
              <Stat label="Sessions" value={overview.sessions} />
              <Stat label="Pageviews" value={overview.pageviews} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <RankedList title="Referrers" items={overview.referrers} />
              <RankedList title="Devices" items={overview.devices} />
              <RankedList title="Browsers" items={overview.browsers} />
            </div>
          </div>
        )}

        {!loading && tab === "engagement" && engagement && (
          <div className="grid gap-4 lg:grid-cols-3">
            <RankedList title="Section views" items={engagement.sections} />
            <RankedList title="Top clicks" items={engagement.topClicks} />
            <RankedList title="Scroll depth events" items={engagement.scrollDepth} />
          </div>
        )}

        {!loading && tab === "heatmap" && heatmap && (
          <HeatmapPanel
            data={heatmap}
            path={heatPath}
            onPathChange={setHeatPath}
          />
        )}

        {!loading && tab === "replays" && (
          <ReplaysPanel
            sessions={sessions}
            activeId={activeReplay}
            onSelect={setActiveReplay}
          />
        )}
      </main>
    </div>
  );
}

function HeatmapPanel({
  data,
  path,
  onPathChange,
}: {
  data: Heatmap;
  path: string;
  onPathChange: (path: string) => void;
}) {
  const maxY = useMemo(
    () => Math.max(100, ...data.points.map((p) => p.y), 100),
    [data.points]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-ink-600">
          Path{" "}
          <select
            value={path}
            onChange={(e) => onPathChange(e.target.value)}
            className="ml-2 border border-ink-200 bg-white px-3 py-1.5"
          >
            {(data.paths.length ? data.paths : [{ name: "/", count: 0 }]).map(
              (p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.count})
                </option>
              )
            )}
          </select>
        </label>
        <span className="text-sm text-ink-500">{data.points.length} clicks</span>
      </div>
      <div
        className="relative overflow-hidden border border-ink-200 bg-[linear-gradient(180deg,#fff,#f3f7f4)]"
        style={{ height: `${Math.min(900, Math.max(420, maxY * 4))}px` }}
      >
        {data.points.map((p, i) => (
          <span
            key={`${p.x}-${p.y}-${i}`}
            title={p.target || undefined}
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-700/35 ring-1 ring-sage-800/20"
            style={{ left: `${p.x}%`, top: `${(p.y / maxY) * 100}%` }}
          />
        ))}
        {data.points.length === 0 && (
          <p className="absolute inset-0 grid place-items-center text-sm text-ink-500">
            No clicks for this path yet
          </p>
        )}
      </div>
    </div>
  );
}

function ReplaysPanel({
  sessions,
  activeId,
  onSelect,
}: {
  sessions: SessionRow[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <ul className="max-h-[70vh] space-y-2 overflow-auto border border-ink-200/70 bg-white/70 p-3">
        {sessions.length === 0 && (
          <li className="px-2 py-3 text-sm text-ink-500">No replays yet</li>
        )}
        {sessions.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect(s.id)}
              className={`w-full px-3 py-2 text-left text-sm transition ${
                activeId === s.id
                  ? "bg-sage-700 text-cream"
                  : "hover:bg-sage-50"
              }`}
            >
              <div className="font-medium">
                {new Date(s.started_at).toLocaleString()}
              </div>
              <div className="truncate opacity-80">
                {[s.ua_device, s.ua_browser].filter(Boolean).join(" · ") ||
                  "unknown device"}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div className="min-h-[420px] border border-ink-200/70 bg-black/90 p-2">
        {activeId ? (
          <ReplayPlayer sessionId={activeId} />
        ) : (
          <p className="grid h-full place-items-center text-sm text-ink-300">
            Select a session to replay
          </p>
        )}
      </div>
    </div>
  );
}

function ReplayPlayer({ sessionId }: { sessionId: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let player: { $destroy?: () => void } | null = null;
    let cancelled = false;

    const run = async () => {
      setError(null);
      try {
        const data = await api<{ ok: boolean; events: unknown[] }>(
          `/api/replay?sessionId=${encodeURIComponent(sessionId)}`
        );
        if (cancelled) return;
        if (!data.events?.length) {
          setError("No replay events for this session");
          return;
        }
        const mod = await import("rrweb-player");
        await import("rrweb-player/dist/style.css");
        const RRWebPlayer = mod.default;
        if (!hostRef.current || cancelled) return;
        hostRef.current.innerHTML = "";
        // rrweb-player is a Svelte component constructor
        player = new RRWebPlayer({
          target: hostRef.current,
          props: {
            events: data.events as never[],
            width: hostRef.current.clientWidth || 800,
            height: 480,
            autoPlay: true,
            showController: true,
          },
        }) as { $destroy?: () => void };
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load replay");
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
      player?.$destroy?.();
    };
  }, [sessionId]);

  return (
    <div>
      {error && <p className="p-4 text-sm text-red-300">{error}</p>}
      <div ref={hostRef} className="overflow-auto" />
    </div>
  );
}
