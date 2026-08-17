type DayRow = {
  day: string;
  sessions: number;
  visitors: number;
};

export function DailySection({ days }: { days: DayRow[] }) {
  const max = Math.max(1, ...days.map((d) => Math.max(d.sessions, d.visitors)));

  return (
    <section className="border border-ink-200/70 bg-white/70 p-5">
      <h3 className="text-sm font-medium text-ink-900">Daily</h3>
      <p className="mt-1 text-sm text-ink-500">
        Visitors and sessions by day (UTC) for the selected range.
      </p>

      {days.length === 0 ? (
        <p className="mt-6 text-sm text-ink-500">No daily activity in this range</p>
      ) : (
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 bg-sage-700" /> Visitors
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 bg-sage-300" /> Sessions
            </span>
          </div>

          <ul className="space-y-2.5">
            {days.map((row) => {
              const label = new Date(`${row.day}T12:00:00Z`).toLocaleDateString(
                undefined,
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                }
              );
              return (
                <li key={row.day}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink-700">{label}</span>
                    <span className="tabular-nums text-ink-500">
                      {row.visitors}v · {row.sessions}s
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 overflow-hidden bg-ink-100">
                      <div
                        className="h-full bg-sage-700"
                        style={{
                          width: `${Math.max(4, (row.visitors / max) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="h-1.5 overflow-hidden bg-ink-100">
                      <div
                        className="h-full bg-sage-300"
                        style={{
                          width: `${Math.max(4, (row.sessions / max) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
