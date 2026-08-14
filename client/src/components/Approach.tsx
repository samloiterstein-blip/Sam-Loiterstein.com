import { Bot, GitBranch, Users, type LucideIcon } from "lucide-react";
import { Section } from "./ui/Section";
import { approach, approachSystem } from "@/data/content";

const NODE_ICONS: Record<(typeof approachSystem.nodes)[number]["id"], LucideIcon> = {
  people: Users,
  workflow: GitBranch,
  agent: Bot,
};

const NODE_LAYOUT = [
  { id: "people", className: "left-1/2 top-0 -translate-x-1/2" },
  { id: "workflow", className: "bottom-0 left-0 sm:left-[2%]" },
  { id: "agent", className: "bottom-0 right-0 sm:right-[2%]" },
] as const;

function ApproachCycleDiagram() {
  const nodeById = Object.fromEntries(approachSystem.nodes.map((node) => [node.id, node]));

  return (
    <div className="relative mx-auto h-[22rem] w-full max-w-md sm:h-[21rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,153,125,0.16),transparent_68%)]"
      />

      <svg
        viewBox="0 0 360 300"
        className="absolute inset-0 h-full w-full text-sage-500"
        aria-hidden
      >
        <defs>
          <marker
            id="approach-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" />
          </marker>
        </defs>
        <circle
          cx="180"
          cy="150"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.18"
          strokeDasharray="3 7"
        />
        <path
          d="M180 62 C118 88, 78 150, 92 210"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeOpacity="0.7"
          markerEnd="url(#approach-arrow)"
        />
        <path
          d="M108 228 C150 268, 210 268, 252 228"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeOpacity="0.7"
          markerEnd="url(#approach-arrow)"
        />
        <path
          d="M268 210 C282 150, 242 88, 180 62"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeOpacity="0.7"
          markerEnd="url(#approach-arrow)"
        />
      </svg>

      <p
        aria-hidden
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[11px] uppercase tracking-[0.18em] text-sage-700/80"
      >
        Feedback
        <span className="mt-0.5 block tracking-[0.14em]">loop</span>
      </p>

      {NODE_LAYOUT.map(({ id, className }) => {
        const node = nodeById[id];
        const Icon = NODE_ICONS[id];
        return (
          <div
            key={id}
            className={`absolute w-[10.75rem] rounded-2xl border border-sage-200/90 bg-white/95 p-3.5 shadow-[0_8px_24px_-14px_rgba(17,29,22,0.28)] backdrop-blur-sm sm:w-[11.5rem] ${className}`}
          >
            <span className="mb-2.5 grid h-8 w-8 place-items-center rounded-xl bg-sage-100 text-sage-800">
              <Icon size={15} strokeWidth={1.75} aria-hidden />
            </span>
            <p className="font-display text-base text-ink-900">{node.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-600">{node.blurb}</p>
          </div>
        );
      })}
    </div>
  );
}

function EngagementStages() {
  return (
    <div className="lg:border-l lg:border-ink-100/80 lg:pl-8">
      <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-sage-800">
        {approachSystem.stagesTitle}
      </h3>
      <ol className="mt-5 space-y-5">
        {approachSystem.stages.map((stage, index) => (
          <li key={stage.title} className="flex gap-3.5 text-sm">
            <span
              aria-hidden
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sage-100 text-xs font-medium text-sage-800"
            >
              {index + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="font-display text-[1.05rem] leading-snug text-ink-900">{stage.title}</p>
              <p className="mt-1 leading-relaxed text-ink-600">{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Approach() {
  return (
    <Section
      id="approach"
      eyebrow={approach.eyebrow}
      title={approach.title}
      description={approach.manifesto}
    >
      <div className="rounded-2xl border border-ink-100/80 bg-white/60 px-5 py-5 sm:px-7 sm:py-7">
        <p className="max-w-3xl text-sm leading-relaxed text-ink-600 sm:text-[0.95rem]">
          {approachSystem.summary}
        </p>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] lg:gap-6 xl:gap-10">
          <ApproachCycleDiagram />
          <EngagementStages />
        </div>
      </div>
    </Section>
  );
}
