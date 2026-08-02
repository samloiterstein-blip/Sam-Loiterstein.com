import { ArrowRight, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { scoreDeal } from "@/lib/dealScoring";
import { DemoFrame } from "./DemoFrame";

type DealClassifierPreviewProps = {
  onOpenDemo?: () => void;
};

const sampleInput = {
  segment: "mid-market" as const,
  stage: "proposal" as const,
  daysInStage: 14,
  lastActivityDays: 5,
  championIdentified: true,
};

export function DealClassifierPreview({ onOpenDemo }: DealClassifierPreviewProps) {
  const result = useMemo(() => scoreDeal(sampleInput), []);

  return (
    <DemoFrame variant="card">
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-ink-100/90 bg-white/95 shadow-[0_8px_28px_-12px_rgba(17,29,22,0.12)] ring-1 ring-ink-900/[0.04]">
        <div className="border-b border-ink-100/80 bg-[var(--brand-surface,#f7f9fc)] px-4 py-3.5 text-center">
          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-accent,#1b3a6b)]/10 text-[var(--brand-accent,#1b3a6b)]">
            <TrendingUp size={16} strokeWidth={2.25} />
          </div>
          <p className="font-display text-[15px] leading-snug text-ink-900">Pipeline tier scorer</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
            Adjust deal signals — get probability tier, forecast action, and manager rationale.
          </p>
        </div>

        <div className="px-4 py-3.5">
          <div className="rounded-xl border border-ink-100/90 bg-white px-3 py-2.5 text-left">
            <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-ink-400">Sample deal</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-sage-900">
                {result.tierLabel}
              </span>
              <span className="font-mono text-sm text-ink-800">{result.probability}%</span>
            </div>
            <p className="mt-1.5 text-[11px] font-medium text-ink-800">{result.action}</p>
          </div>
        </div>

        {onOpenDemo && (
          <div className="border-t border-ink-100/80 bg-ink-50/40 px-4 py-2.5">
            <button
              type="button"
              onClick={onOpenDemo}
              className="flex w-full items-center justify-center gap-1.5 text-[11px] font-medium text-[var(--brand-accent,#1b3a6b)] transition hover:opacity-80"
            >
              Open interactive demo
              <ArrowRight size={12} strokeWidth={2.25} />
            </button>
          </div>
        )}
      </div>
    </DemoFrame>
  );
}
