import { useMemo, useState } from "react";

type DayRow = {
  day: string;
  sessions: number;
  visitors: number;
};

type Props = {
  days: DayRow[];
  from: string;
  to: string;
};

const WIDTH = 800;
const HEIGHT = 280;
const PAD = { top: 16, right: 16, bottom: 36, left: 36 };

function utcDate(isoDay: string): Date {
  return new Date(`${isoDay}T12:00:00Z`);
}

function enumerateDays(from: string, to: string): string[] {
  const start = utcDate(from);
  const end = utcDate(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }
  const out: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

function niceMax(value: number): number {
  if (value <= 4) return 4;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / exp;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return nice * exp;
}

function yTicks(max: number): number[] {
  const steps = 4;
  return Array.from({ length: steps + 1 }, (_, i) => Math.round((max / steps) * i));
}

function xLabelStep(n: number): number {
  if (n <= 8) return 1;
  if (n <= 14) return 2;
  if (n <= 31) return 5;
  if (n <= 90) return 14;
  return Math.ceil(n / 7);
}

function formatTick(isoDay: string, span: number): string {
  return utcDate(isoDay).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(span <= 14 ? { weekday: "short" as const } : {}),
    timeZone: "UTC",
  });
}

function polyline(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function DailySection({ days, from, to }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const series = useMemo(() => {
    const byDay = new Map(days.map((row) => [row.day, row]));
    const start =
      from <= "1971-01-01" && days[0]?.day ? days[0].day : from;
    const keys = enumerateDays(start, to);
    return keys.map((day) => ({
      day,
      visitors: byDay.get(day)?.visitors ?? 0,
      sessions: byDay.get(day)?.sessions ?? 0,
    }));
  }, [days, from, to]);

  const max = useMemo(
    () => niceMax(Math.max(1, ...series.map((d) => Math.max(d.sessions, d.visitors)))),
    [series]
  );

  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const xAt = (i: number) =>
    PAD.left + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
  const yAt = (value: number) => PAD.top + innerH - (value / max) * innerH;

  const visitorPts = series.map((d, i) => ({ x: xAt(i), y: yAt(d.visitors) }));
  const sessionPts = series.map((d, i) => ({ x: xAt(i), y: yAt(d.sessions) }));
  const ticks = yTicks(max);
  const step = xLabelStep(series.length);
  const active = hover != null ? series[hover] : null;
  const hasActivity = series.some((d) => d.visitors > 0 || d.sessions > 0);

  return (
    <section className="border border-ink-200/70 bg-white/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-ink-900">Daily</h3>
          <p className="mt-1 text-sm text-ink-500">
            Visitors and sessions by day (UTC) for the selected range.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-sage-700" /> Visitors
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-sage-300" /> Sessions
          </span>
        </div>
      </div>

      {!hasActivity ? (
        <p className="mt-6 text-sm text-ink-500">No daily activity in this range</p>
      ) : (
        <div className="relative mt-4">
          {active && (
            <div className="pointer-events-none absolute right-0 top-0 rounded border border-ink-200 bg-white/95 px-2.5 py-1.5 text-xs text-ink-700 shadow-sm">
              <div className="font-medium text-ink-900">
                {utcDate(active.day).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </div>
              <div className="mt-0.5 tabular-nums">
                {active.visitors} visitors · {active.sessions} sessions
              </div>
            </div>
          )}

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-64 w-full"
            role="img"
            aria-label="Daily visitors and sessions line chart"
            onMouseLeave={() => setHover(null)}
          >
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={yAt(tick)}
                  y2={yAt(tick)}
                  stroke="#e8ebe6"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 8}
                  y={yAt(tick) + 3}
                  textAnchor="end"
                  className="fill-ink-400"
                  fontSize="10"
                >
                  {tick}
                </text>
              </g>
            ))}

            <polyline
              fill="none"
              stroke="#9fbca5"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={polyline(sessionPts)}
            />
            <polyline
              fill="none"
              stroke="#324f3c"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={polyline(visitorPts)}
            />

            {series.length <= 31 &&
              series.map((d, i) => (
                <g key={d.day}>
                  <circle cx={xAt(i)} cy={yAt(d.sessions)} r="2.5" fill="#9fbca5" />
                  <circle cx={xAt(i)} cy={yAt(d.visitors)} r="2.5" fill="#324f3c" />
                </g>
              ))}

            {hover != null && series[hover] && (
              <line
                x1={xAt(hover)}
                x2={xAt(hover)}
                y1={PAD.top}
                y2={HEIGHT - PAD.bottom}
                stroke="#b3b3ad"
                strokeDasharray="3 3"
              />
            )}

            {series.map((d, i) =>
              i % step === 0 || i === series.length - 1 ? (
                <text
                  key={d.day}
                  x={xAt(i)}
                  y={HEIGHT - 12}
                  textAnchor="middle"
                  className="fill-ink-400"
                  fontSize="10"
                >
                  {formatTick(d.day, series.length)}
                </text>
              ) : null
            )}

            {series.map((d, i) => (
              <rect
                key={`hit-${d.day}`}
                x={xAt(i) - innerW / series.length / 2}
                y={PAD.top}
                width={Math.max(8, innerW / series.length)}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}
