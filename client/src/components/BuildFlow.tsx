import { useState } from "react";
import { Activity, Code2, FileText, MessageCircle, RefreshCw, type LucideIcon } from "lucide-react";
import { buildFlow } from "@/data/content";
import { cn } from "@/lib/cn";

type Phase = (typeof buildFlow.phases)[number];
type PhaseId = Phase["id"];

const phaseIcon: Record<PhaseId, LucideIcon> = {
  plan: FileText,
  build: Code2,
  review: MessageCircle,
  iterate: RefreshCw,
  optimize: Activity,
};

const phaseClass: Record<PhaseId, string> = {
  plan: "border border-sage-200 bg-white text-sage-900",
  build: "bg-[#6f8d78] text-white",
  review: "bg-[#3e5a49] text-white",
  iterate: "bg-sage-600 text-white",
  optimize: "border border-sage-200 bg-white/90 text-sage-900",
};

function PhaseButton({
  phase,
  active,
  onSelect,
  className,
}: {
  phase: Phase;
  active: boolean;
  onSelect: (id: PhaseId) => void;
  className?: string;
}) {
  const Icon = phaseIcon[phase.id];
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-describedby={active ? "build-phase-detail" : undefined}
      onMouseEnter={() => onSelect(phase.id)}
      onFocus={() => onSelect(phase.id)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm transition",
        phaseClass[phase.id],
        active && "ring-2 ring-sage-800/25 ring-offset-2 ring-offset-cream",
        className
      )}
    >
      <span className="text-[10px] font-semibold tracking-[0.14em] opacity-70">{phase.index}</span>
      <Icon size={14} strokeWidth={1.75} aria-hidden />
      {phase.label}
    </button>
  );
}

function PhaseDetail({ phase }: { phase: Phase }) {
  return (
    <div id="build-phase-detail" className="mt-8 rounded-2xl border border-sage-200 bg-white p-5 text-left sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-10">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-sage-800">
            {phase.index} {phase.label}
          </p>
          <p className="mt-2 font-display text-xl leading-snug text-ink-900">{phase.summary}</p>
          <p className="mt-3 text-sm leading-relaxed text-sage-800">Outcome: {phase.outcome}</p>
        </div>
        <ul className="space-y-1.5 text-sm leading-relaxed text-ink-700">
          {phase.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BuildFlow() {
  const [activeId, setActiveId] = useState<PhaseId | null>(null);
  const active = buildFlow.phases.find((phase) => phase.id === activeId) ?? null;
  const plan = buildFlow.phases[0];
  const build = buildFlow.phases[1];
  const review = buildFlow.phases[2];
  const iterate = buildFlow.phases[3];
  const optimize = buildFlow.phases[4];

  return (
    <div
      className="relative shrink-0 text-left"
      onMouseLeave={() => setActiveId(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActiveId(null);
      }}
    >
      <h3 className="font-display text-3xl font-medium tracking-tightish text-ink-900 sm:text-4xl">{buildFlow.title}</h3>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{buildFlow.description}</p>
      <p className="mt-2 text-sm italic text-ink-500">{buildFlow.hint}</p>

      <div className="mt-8 flex items-center gap-3 sm:mt-10">
        <div className="flex shrink-0 items-center gap-2">
          <PhaseButton phase={plan} active={activeId === plan.id} onSelect={setActiveId} />
          <svg width="28" height="12" viewBox="0 0 28 12" fill="none" aria-hidden className="shrink-0 text-sage-400">
            <path d="M0 6h22" stroke="currentColor" strokeWidth="1.25" />
            <path d="M20 2.25 26 6l-6 3.75" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="relative h-40 w-[19.5rem] shrink-0">
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 312 160" fill="none" aria-hidden>
            <path d="M118 36C168 8 230 18 248 58" stroke="#9fbca5" strokeWidth="1.35" />
            <path d="M241 50.5 250 62 236 62" stroke="#9fbca5" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M236 96C214 132 150 146 112 132" stroke="#9fbca5" strokeWidth="1.35" />
            <path d="M122 128 104 134 116 144" stroke="#9fbca5" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M78 118C48 96 46 58 78 40" stroke="#9fbca5" strokeWidth="1.35" />
            <path d="M70 48 82 34 90 50" stroke="#9fbca5" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <PhaseButton
            phase={build}
            active={activeId === build.id}
            onSelect={setActiveId}
            className="absolute left-0 top-1"
          />
          <PhaseButton
            phase={review}
            active={activeId === review.id}
            onSelect={setActiveId}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          />
          <PhaseButton
            phase={iterate}
            active={activeId === iterate.id}
            onSelect={setActiveId}
            className="absolute bottom-1 left-8"
          />
        </div>

        <svg width="36" height="12" viewBox="0 0 36 12" fill="none" aria-hidden className="hidden shrink-0 text-sage-400 sm:block">
          <path d="M0 6h28" stroke="currentColor" strokeWidth="1.25" />
          <path d="M26 2.25 34 6l-8 3.75" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <PhaseButton
          phase={optimize}
          active={activeId === optimize.id}
          onSelect={setActiveId}
          className="h-12 min-w-0 flex-1 justify-start rounded-2xl px-5"
        />
      </div>
      {active && <PhaseDetail phase={active} />}
    </div>
  );
}
