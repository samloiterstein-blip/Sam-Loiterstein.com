import { useId, useRef, useState } from "react";
import {
  BadgeCheck,
  Bot,
  GitBranch,
  GraduationCap,
  Landmark,
  Network,
  Shield,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Section } from "./ui/Section";
import {
  approach,
  approachTabs,
  type ApproachNodeId,
  type ApproachTab,
  type ApproachTabId,
} from "@/data/content";
import { cn } from "@/lib/cn";

const NODE_ICONS: Record<ApproachNodeId, LucideIcon> = {
  people: Users,
  workflow: GitBranch,
  agent: Bot,
  scale: Network,
  trust: Shield,
  ai: Sparkles,
  academic: GraduationCap,
  credentials: BadgeCheck,
  institution: Landmark,
};

const NODE_LAYOUT = [
  { index: 0, className: "left-1/2 top-0 -translate-x-1/2" },
  { index: 1, className: "bottom-0 left-0 sm:left-[2%]" },
  { index: 2, className: "bottom-0 right-0 sm:right-[2%]" },
] as const;

function ApproachCycleDiagram({ tab }: { tab: ApproachTab }) {
  const markerId = useId().replace(/:/g, "");

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
            id={markerId}
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
          markerEnd={`url(#${markerId})`}
        />
        <path
          d="M108 228 C150 268, 210 268, 252 228"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeOpacity="0.7"
          markerEnd={`url(#${markerId})`}
        />
        <path
          d="M268 210 C282 150, 242 88, 180 62"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeOpacity="0.7"
          markerEnd={`url(#${markerId})`}
        />
      </svg>

      <p
        aria-hidden
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[11px] uppercase tracking-[0.18em] text-sage-700/80"
      >
        {tab.diagramLabel[0]}
        <span className="mt-0.5 block tracking-[0.14em]">{tab.diagramLabel[1]}</span>
      </p>

      {NODE_LAYOUT.map(({ index, className }) => {
        const node = tab.nodes[index];
        if (!node) return null;
        const Icon = NODE_ICONS[node.id];
        return (
          <div
            key={node.id}
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

function EngagementStages({ tab }: { tab: ApproachTab }) {
  return (
    <div className="lg:border-l lg:border-ink-100/80 lg:pl-8">
      <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-sage-800">
        {tab.stagesTitle}
      </h3>
      <ol className="mt-5 space-y-5">
        {tab.stages.map((stage, index) => (
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

function ApproachTabPanel({ tab }: { tab: ApproachTab }) {
  return (
    <div className="mt-6">
      <p className="max-w-3xl text-sm leading-relaxed text-ink-600 sm:text-[0.95rem]">{tab.summary}</p>

      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] lg:gap-6 xl:gap-10">
        <ApproachCycleDiagram tab={tab} />
        <EngagementStages tab={tab} />
      </div>
    </div>
  );
}

export function Approach() {
  const [activeId, setActiveId] = useState<ApproachTabId>("process");
  const activeTab = approachTabs.find((tab) => tab.id === activeId) ?? approachTabs[0];
  const baseId = useId();
  const tabRefs = useRef<Partial<Record<ApproachTabId, HTMLButtonElement | null>>>({});

  const selectTab = (id: ApproachTabId) => {
    setActiveId(id);
    queueMicrotask(() => tabRefs.current[id]?.focus());
  };

  return (
    <Section
      id="approach"
      eyebrow={approach.eyebrow}
      title={approach.title}
      description={approach.manifesto}
    >
      <div className="rounded-2xl border border-ink-100/80 bg-white/60 px-5 py-5 sm:px-7 sm:py-7">
        <div
          role="tablist"
          aria-label="Approach views"
          className="flex flex-wrap gap-2 border-b border-ink-100/90 pb-4"
        >
          {approachTabs.map((tab) => {
            const selected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                id={`${baseId}-${tab.id}-tab`}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-${tab.id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(event) => {
                  const currentIndex = approachTabs.findIndex((t) => t.id === activeId);
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    const delta = event.key === "ArrowRight" ? 1 : -1;
                    const next = approachTabs[(currentIndex + delta + approachTabs.length) % approachTabs.length];
                    selectTab(next.id);
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    selectTab(approachTabs[0].id);
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    selectTab(approachTabs[approachTabs.length - 1].id);
                  }
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500/40",
                  selected
                    ? "bg-sage-700 text-cream shadow-[0_4px_14px_-6px_rgba(35,54,42,0.45)]"
                    : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-sage-50 hover:text-sage-800 hover:ring-sage-300"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {approachTabs.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <div
              key={tab.id}
              id={`${baseId}-${tab.id}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-${tab.id}-tab`}
              hidden={!selected}
            >
              {selected ? <ApproachTabPanel tab={activeTab} /> : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
