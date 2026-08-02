import { ArrowUpRight } from "lucide-react";
import { DemoFrame } from "./DemoFrame";

export function SynthEmbed() {
  return (
    <DemoFrame>
      <div className="flex w-full max-w-[280px] flex-col items-center gap-4">
        <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff007f] to-[#cc0066] p-4 text-center text-white shadow-[0_16px_40px_-12px_rgba(255,0,127,0.35)]">
          <div className="font-display text-lg font-medium">Synth</div>
          <p className="mt-1 text-xs text-white/90">Live music discovery — the product is live</p>
          <div className="mt-3 space-y-1.5">
            <div className="h-2 rounded-full bg-white/20" />
            <div className="h-2 w-4/5 mx-auto rounded-full bg-white/20" />
            <div className="h-2 w-3/5 mx-auto rounded-full bg-white/20" />
          </div>
        </div>

        <a
          href="https://getsynth.app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-ink-800"
        >
          Open Synth
          <ArrowUpRight size={16} />
        </a>

        <p className="text-center text-[10px] leading-relaxed text-ink-400">
          Genre intelligence powers personalized feeds at getsynth.app
        </p>
      </div>
    </DemoFrame>
  );
}
