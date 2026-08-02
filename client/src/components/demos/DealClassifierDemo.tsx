import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  scoreDeal,
  type DealInput,
  type Segment,
  type Stage,
} from "@/lib/dealScoring";

const segments: { value: Segment; label: string }[] = [
  { value: "enterprise", label: "Enterprise" },
  { value: "mid-market", label: "Mid-market" },
  { value: "smb", label: "SMB" },
];

const stages: { value: Stage; label: string }[] = [
  { value: "discovery", label: "Discovery" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "stalled", label: "Stalled" },
];

const tierColor: Record<number, string> = {
  1: "bg-sage-700 text-cream",
  2: "bg-sage-100 text-sage-900",
  3: "bg-amber-50 text-amber-800",
  4: "bg-ink-50 text-ink-500",
};

export function DealClassifierDemo({ embedded = false }: { embedded?: boolean }) {
  const [input, setInput] = useState<DealInput>({
    segment: "mid-market",
    stage: "proposal",
    daysInStage: 14,
    lastActivityDays: 5,
    championIdentified: true,
  });

  const result = useMemo(() => scoreDeal(input), [input]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-100 bg-white/80",
        embedded ? "space-y-2.5 p-3" : "space-y-4 p-4"
      )}
    >
      {!embedded && (
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-500">Live demo</div>
          <p className="mt-1 text-sm text-ink-600">
            Tune pipeline signals and see how the classification framework maps behavior to forecast tiers.
          </p>
        </div>
      )}

      <div className={cn(embedded ? "space-y-2" : "space-y-3")}>
        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-400">Segment</div>
          <div className="flex flex-wrap gap-1">
            {segments.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setInput((prev) => ({ ...prev, segment: s.value }))}
                className={cn(
                  "rounded-full font-medium transition",
                  embedded ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                  input.segment === s.value ? "bg-ink-900 text-cream" : "bg-ink-50 text-ink-500"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-400">Stage</div>
          <div className="flex flex-wrap gap-1">
            {stages.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setInput((prev) => ({ ...prev, stage: s.value }))}
                className={cn(
                  "rounded-lg font-medium transition",
                  embedded ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                  input.stage === s.value ? "bg-ink-900 text-cream" : "bg-ink-50 text-ink-500"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className={cn("grid grid-cols-2 gap-2", embedded ? "text-xs" : "gap-3 text-sm")}>
          <label className="space-y-0.5">
            <span className="text-[10px] text-ink-500">Days in stage</span>
            <input
              type="number"
              min={0}
              max={120}
              value={input.daysInStage}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, daysInStage: Number(e.target.value) || 0 }))
              }
              className={cn(
                "w-full rounded-lg border border-ink-100 bg-white text-ink-800",
                embedded ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
              )}
            />
          </label>
          <label className="space-y-0.5">
            <span className="text-[10px] text-ink-500">Last activity (days)</span>
            <input
              type="number"
              min={0}
              max={90}
              value={input.lastActivityDays}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, lastActivityDays: Number(e.target.value) || 0 }))
              }
              className={cn(
                "w-full rounded-lg border border-ink-100 bg-white text-ink-800",
                embedded ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
              )}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() =>
            setInput((prev) => ({ ...prev, championIdentified: !prev.championIdentified }))
          }
          className={cn(
            "w-full rounded-lg font-medium transition",
            embedded ? "py-1.5 text-[10px]" : "py-2 text-xs",
            input.championIdentified ? "bg-sage-100 text-sage-900" : "bg-ink-50 text-ink-500"
          )}
        >
          Champion identified: {input.championIdentified ? "Yes" : "No"}
        </button>

        <div className={cn("rounded-xl border border-ink-100 bg-[var(--brand-surface,#f7f9fc)]", embedded ? "p-2.5" : "p-4")}>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full font-semibold",
                embedded ? "px-2 py-px text-[10px]" : "px-2.5 py-0.5 text-xs",
                tierColor[result.tier]
              )}
            >
              {result.tierLabel}
            </span>
            <span className={cn("font-mono text-ink-800", embedded ? "text-sm" : "text-lg")}>
              {result.probability}%
            </span>
            <span className="text-[10px] text-ink-500">win probability</span>
          </div>
          <p className={cn("font-semibold text-ink-900", embedded ? "mt-1.5 text-xs" : "mt-3 text-sm")}>
            {result.action}
          </p>
          {!embedded && (
            <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{result.rationale}</p>
          )}
        </div>
      </div>
    </div>
  );
}
