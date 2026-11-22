import { CircleDot, LayoutGrid, Search, type LucideIcon } from "lucide-react";
import { waysToWork } from "@/data/content";
import { contactHref, openContact } from "@/lib/contactIntent";
import { cn } from "@/lib/cn";
import { BuildFlow } from "./BuildFlow";

const toneStyle = {
  build: {
    icon: LayoutGrid,
    card: "border-ink-200 bg-white",
    rule: "bg-sage-600",
  },
  retainer: {
    icon: CircleDot,
    card: "border-sage-200 bg-sage-50",
    rule: "bg-sage-800",
  },
  sprint: {
    icon: Search,
    card: "border-ink-200 bg-white",
    rule: "bg-[#b9a27a]",
  },
} as const satisfies Record<
  (typeof waysToWork.modes)[number]["tone"],
  { icon: LucideIcon; card: string; rule: string }
>;

export function Approach() {
  return (
    <section id="approach" className="scroll-mt-24 pb-14 pt-0 sm:pb-16 lg:pb-20">
      <div className="container-page">
      <div className="h-px bg-sage-300/80" />
      <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-sage-800 sm:mt-10 sm:text-xs">
        {waysToWork.eyebrow}
      </p>
      <h2 className="mt-3 text-center font-display text-4xl font-medium tracking-tightish text-ink-900 sm:text-5xl lg:text-6xl">
        {waysToWork.title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-ink-600 sm:text-lg">
        {waysToWork.description}
      </p>
      <ol className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-3">
        {waysToWork.modes.map((mode) => {
          const tone = toneStyle[mode.tone];
          const Icon = tone.icon;
          return (
            <li
              key={mode.index}
              className={cn("flex flex-col overflow-hidden rounded-2xl border", tone.card)}
            >
              <div className={cn("h-1", tone.rule)} />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">
                    {mode.index} <span className="ml-2">{mode.kicker}</span>
                  </p>
                  <Icon size={18} strokeWidth={1.5} className="text-ink-400" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-2xl leading-tight text-ink-900">{mode.title}</h3>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">Best when</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{mode.bestWhen}</p>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">What I do</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{mode.whatIDo}</p>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">{mode.outcomesLabel}</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {mode.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="rounded-full bg-sage-100 px-3 py-1 text-xs text-sage-800"
                    >
                      {outcome}
                    </li>
                  ))}
                </ul>
                <a
                  href={contactHref(mode.intent)}
                  data-analytics={`cta:engagement-${mode.tone}`}
                  onClick={(event) => {
                    event.preventDefault();
                    openContact(mode.intent);
                  }}
                  className="mt-auto pt-6 text-sm font-medium text-ink-900 underline decoration-ink-300 underline-offset-4 transition hover:text-sage-800"
                >
                  {mode.cta} →
                </a>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-14 sm:mt-16 lg:mt-20">
        <BuildFlow />
      </div>
      </div>
    </section>
  );
}
