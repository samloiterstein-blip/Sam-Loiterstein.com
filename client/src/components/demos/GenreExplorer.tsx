import { ArrowRight, Music2 } from "lucide-react";
import { connectSpotify } from "@/lib/genreFeedApi";
import { DemoFrame } from "./DemoFrame";

type GenreExplorerProps = {
  onOpenDemo?: () => void;
};

export function GenreExplorer({ onOpenDemo }: GenreExplorerProps) {
  return (
    <DemoFrame variant="card">
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-ink-100/90 bg-white/95 shadow-[0_8px_28px_-12px_rgba(17,29,22,0.12)] ring-1 ring-ink-900/[0.04]">
        <div className="border-b border-ink-100/80 bg-[var(--brand-surface,#fff8fb)] px-4 py-3.5 text-center">
          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-accent,#ff007f)]/10 text-[var(--brand-accent,#ff007f)]">
            <Music2 size={16} strokeWidth={2.25} />
          </div>
          <p className="font-display text-[15px] leading-snug text-ink-900">Personalized show feed</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
            Connect your library — get upcoming shows near you, ranked by genre affinity.
          </p>
        </div>

        <div className="space-y-2 px-4 py-3.5">
          <button
            type="button"
            onClick={() => connectSpotify()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1DB954] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1aa34a]"
          >
            Import Spotify
          </button>
          <button
            type="button"
            onClick={onOpenDemo}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200/90 bg-white px-3 py-2.5 text-xs font-semibold text-ink-800 transition hover:border-ink-300 hover:bg-ink-50/80"
          >
            Import Apple Music
          </button>
        </div>

        {onOpenDemo && (
          <div className="border-t border-ink-100/80 bg-ink-50/40 px-4 py-2.5">
            <button
              type="button"
              onClick={onOpenDemo}
              className="flex w-full items-center justify-center gap-1.5 text-[11px] font-medium text-[var(--brand-accent,#ff007f)] transition hover:opacity-80"
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
