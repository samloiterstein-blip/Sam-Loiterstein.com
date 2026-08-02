import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { DemoFrame } from "./DemoFrame";
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

export function DealClassifier() {
  const [input, setInput] = useState<DealInput>({
    segment: "mid-market",
    stage: "proposal",
    daysInStage: 14,
    lastActivityDays: 5,
    championIdentified: true,
  });

  const result = useMemo(() => scoreDeal(input), [input]);

  return (
    <DemoFrame>
      <div className="w-full max-w-[300px] space-y-3">
        <div className="flex flex-wrap gap-1">
          {segments.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setInput((prev) => ({ ...prev, segment: s.value }))}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium transition",
                input.segment === s.value ? "bg-ink-900 text-cream" : "bg-ink-50 text-ink-500"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {stages.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setInput((prev) => ({ ...prev, stage: s.value }))}
              className={cn(
                "rounded-lg px-2 py-1 text-[10px] font-medium transition",
                input.stage === s.value ? "bg-ink-900 text-cream" : "bg-ink-50 text-ink-500"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <label className="space-y-1">
            <span className="text-ink-400">Days in stage</span>
            <input
              type="number"
              min={0}
              max={120}
              value={input.daysInStage}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, daysInStage: Number(e.target.value) || 0 }))
              }
              className="w-full rounded-lg border border-ink-100 bg-white px-2 py-1 text-ink-800"
            />
          </label>
          <label className="space-y-1">
            <span className="text-ink-400">Last activity (days)</span>
            <input
              type="number"
              min={0}
              max={90}
              value={input.lastActivityDays}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, lastActivityDays: Number(e.target.value) || 0 }))
              }
              className="w-full rounded-lg border border-ink-100 bg-white px-2 py-1 text-ink-800"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() =>
            setInput((prev) => ({ ...prev, championIdentified: !prev.championIdentified }))
          }
          className={cn(
            "w-full rounded-lg py-1.5 text-[10px] font-medium transition",
            input.championIdentified ? "bg-sage-100 text-sage-900" : "bg-ink-50 text-ink-500"
          )}
        >
          Champion identified: {input.championIdentified ? "Yes" : "No"}
        </button>

        <div className="rounded-xl border border-ink-100 bg-white/80 p-3">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", tierColor[result.tier])}>
              {result.tierLabel}
            </span>
            <span className="font-mono text-sm text-ink-700">{result.probability}%</span>
          </div>
          <p className="mt-2 text-xs font-medium text-ink-800">{result.action}</p>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-500">{result.rationale}</p>
        </div>
      </div>
    </DemoFrame>
  );
}
