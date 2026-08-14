type NamedCount = { name: string; count: number };

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-ink-200/70 bg-white/70 px-5 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-ink-500">{label}</div>
      <div className="mt-2 font-display text-3xl text-ink-900">{value}</div>
    </div>
  );
}

export function RankedList({
  title,
  items,
  empty = "No data yet",
}: {
  title: string;
  items: NamedCount[];
  empty?: string;
}) {
  const max = items[0]?.count || 1;
  return (
    <section className="border border-ink-200/70 bg-white/70 p-5">
      <h3 className="text-sm font-medium text-ink-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-500">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.map((item) => (
            <li key={item.name}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-ink-700">{item.name}</span>
                <span className="shrink-0 tabular-nums text-ink-500">{item.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden bg-ink-100">
                <div
                  className="h-full bg-sage-600"
                  style={{ width: `${Math.max(6, (item.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
