import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { DemoFrame } from "./DemoFrame";
import { classifySignal, sampleHeadlines, type SignalCategory } from "@/lib/signalClassifier";

const categoryColor: Record<SignalCategory, string> = {
  Funding: "bg-emerald-100 text-emerald-900",
  "Product launch": "bg-blue-100 text-blue-900",
  "Leadership change": "bg-violet-100 text-violet-900",
  Partnership: "bg-amber-100 text-amber-900",
  Expansion: "bg-orange-100 text-orange-900",
  "Low relevance": "bg-ink-50 text-ink-500",
};

export function SignalClassifier() {
  const [text, setText] = useState(sampleHeadlines[0]);
  const result = useMemo(() => classifySignal(text), [text]);

  return (
    <DemoFrame>
      <div className="w-full max-w-[300px] space-y-3">
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-ink-400">Headline or snippet</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-ink-100 bg-white px-2.5 py-2 text-xs leading-relaxed text-ink-800"
            placeholder="Paste a news headline…"
          />
        </label>

        <div className="flex flex-wrap gap-1">
          {sampleHeadlines.slice(0, 3).map((h, i) => (
            <button
              key={h}
              type="button"
              onClick={() => setText(h)}
              className="rounded-full bg-ink-50 px-2 py-0.5 text-[9px] text-ink-500 transition hover:bg-ink-100"
            >
              Example {i + 1}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-ink-100 bg-white/80 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", categoryColor[result.category])}>
              {result.category}
            </span>
            <span className="font-mono text-[10px] text-ink-400">{result.confidence}% conf.</span>
          </div>
          <p className="mt-2 text-xs font-medium leading-snug text-ink-800">{result.hook}</p>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-500">{result.rationale}</p>
        </div>
      </div>
    </DemoFrame>
  );
}

/** @deprecated Use SignalClassifier */
export const JamBaseWalkthrough = SignalClassifier;
