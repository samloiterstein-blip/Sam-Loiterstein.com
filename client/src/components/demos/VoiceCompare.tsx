import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { DemoFrame } from "./DemoFrame";
import { analyzeDraft, starterDrafts } from "@/lib/voiceAnalysis";

export function VoiceCompare({ embedded = false }: { embedded?: boolean; onOpenDemo?: () => void }) {
  const [text, setText] = useState(starterDrafts.generic);
  const analysis = useMemo(() => analyzeDraft(text), [text]);

  return (
    <DemoFrame>
      <div className={embedded ? "w-full space-y-4 p-1" : "w-full max-w-[300px] space-y-3"}>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setText(starterDrafts.generic)}
            className="flex-1 rounded-lg bg-ink-50 py-1 text-[10px] font-medium text-ink-500 transition hover:bg-ink-100"
          >
            Load generic
          </button>
          <button
            type="button"
            onClick={() => setText(starterDrafts.voice)}
            className="flex-1 rounded-lg bg-ink-50 py-1 text-[10px] font-medium text-ink-500 transition hover:bg-ink-100"
          >
            Load controlled
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={embedded ? 5 : 3}
          className="w-full resize-none rounded-xl border border-sage-200/80 bg-white px-3 py-2.5 text-sm leading-relaxed text-ink-800 ring-1 ring-sage-200/60 focus:ring-2 focus:ring-sage-500/30"
          placeholder="Paste your LinkedIn draft…"
        />

        <div className="rounded-xl border border-ink-100 bg-white/80 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-ink-400">Voice score</span>
            <span
              className={cn(
                "font-mono text-sm font-medium",
                analysis.voiceScore >= 70
                  ? "text-sage-800"
                  : analysis.voiceScore >= 45
                    ? "text-amber-700"
                    : "text-ink-500"
              )}
            >
              {analysis.voiceScore}/100
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-600">{analysis.summary}</p>

          {analysis.clicheHits.length > 0 && (
            <p className="mt-2 text-[10px] text-amber-700">
              Clichés: {analysis.clicheHits.slice(0, 3).join(", ")}
            </p>
          )}

          <ul className="mt-2 space-y-1">
            {analysis.markers.map((m) => (
              <li key={m.label} className="flex items-center gap-1.5 text-[10px]">
                <span className={cn("h-1.5 w-1.5 rounded-full", m.passed ? "bg-sage-600" : "bg-ink-200")} />
                <span className={m.passed ? "text-ink-700" : "text-ink-400"}>{m.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DemoFrame>
  );
}
