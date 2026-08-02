import { ArrowRight } from "lucide-react";
import { DemoFrame } from "./DemoFrame";

type SdrBasePreviewProps = {
  onOpenDemo?: () => void;
};

export function SdrBasePreview({ onOpenDemo }: SdrBasePreviewProps) {
  return (
    <DemoFrame variant="card">
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-[linear-gradient(165deg,#f8f7f2,#eef3ef)] ring-1 ring-sage-200/90 shadow-soft">
        <div className="border-b border-sage-200/70 bg-white/50 px-3 py-2.5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-sm font-medium text-ink-900">Acme SDR</span>
            <span className="rounded-full bg-sage-100 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider text-sage-700">
              Demo
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {["RevOps", "Deals", "GPT"].map((t) => (
              <span
                key={t}
                className={
                  t === "RevOps"
                    ? "rounded-lg bg-sage-700 px-2 py-0.5 text-[9px] font-medium text-cream"
                    : "rounded-lg bg-white/80 px-2 py-0.5 text-[9px] text-ink-500 ring-1 ring-sage-200/80"
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 p-3">
          <div className="rounded-xl bg-white/90 p-2.5 ring-1 ring-sage-200/70">
            <div className="text-[9px] uppercase tracking-wider text-ink-400">Forecast coverage</div>
            <div className="font-display text-lg text-ink-900">1.8×</div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sage-100">
              <div className="h-full w-[72%] rounded-full bg-sage-600" />
            </div>
          </div>
          <p className="text-[10px] leading-relaxed text-ink-500">
            Pipeline, sequences, signals & AI — one workspace.
          </p>
        </div>

        {onOpenDemo && (
          <div className="border-t border-sage-200/60 bg-white/40 px-3 py-2">
            <button
              type="button"
              onClick={onOpenDemo}
              className="flex w-full items-center justify-center gap-1 text-[11px] font-medium text-sage-700 transition hover:text-sage-900"
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
