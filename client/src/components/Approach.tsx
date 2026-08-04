import { ArrowRight } from "lucide-react";
import { Section } from "./ui/Section";
import { approach, approachSystem, principlesSection } from "@/data/content";

const NODE_LAYOUT = [
  { id: "people", className: "left-1/2 top-0 -translate-x-1/2" },
  { id: "workflow", className: "bottom-0 left-0" },
  { id: "agent", className: "bottom-0 right-0" },
] as const;

function ApproachCycleDiagram() {
  const nodeById = Object.fromEntries(approachSystem.nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-2xl border border-ink-100/80 bg-white/60 px-5 py-5 sm:px-6 sm:py-6">
      <p className="text-sm leading-relaxed text-ink-600">{approachSystem.summary}</p>

      <div className="relative mx-auto mt-6 h-[22rem] max-w-lg sm:h-[20rem]">
        <svg
          viewBox="0 0 360 300"
          className="absolute inset-0 h-full w-full text-sage-500/70"
          aria-hidden
        >
          <defs>
            <marker
              id="approach-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
            </marker>
          </defs>
          <path
            d="M180 72 C120 120, 80 170, 72 228"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#approach-arrow)"
          />
          <path
            d="M72 228 C150 250, 210 250, 288 228"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#approach-arrow)"
          />
          <path
            d="M288 228 C280 170, 240 120, 180 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#approach-arrow)"
          />
          <path
            d="M180 72 C240 120, 280 170, 288 228"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            markerEnd="url(#approach-arrow)"
          />
          <path
            d="M288 228 C210 250, 150 250, 72 228"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            markerEnd="url(#approach-arrow)"
          />
          <path
            d="M72 228 C80 170, 120 120, 180 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            markerEnd="url(#approach-arrow)"
          />
        </svg>

        {NODE_LAYOUT.map(({ id, className }) => {
          const node = nodeById[id];
          return (
            <div
              key={id}
              className={`absolute w-[9.5rem] rounded-xl border border-sage-200/80 bg-cream/90 p-3 shadow-[0_2px_12px_-4px_rgba(17,29,22,0.12)] sm:w-[10.5rem] ${className}`}
            >
              <p className="font-display text-base text-ink-900">{node.label}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-600">{node.blurb}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-ink-100/80 pt-5">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink-500">
          {approachSystem.stagesTitle}
        </h3>
        <ol className="mt-4 space-y-3">
          {approachSystem.stages.map((stage, index) => (
            <li key={stage.title} className="flex gap-3 text-sm">
              <span
                aria-hidden
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage-100 text-[11px] font-medium text-sage-800"
              >
                {index + 1}
              </span>
              <div>
                <p className="font-display text-base text-ink-900">{stage.title}</p>
                <p className="mt-0.5 leading-relaxed text-ink-600">{stage.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Approach() {
  const scrollToSystems = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section
      id="approach"
      eyebrow={approach.eyebrow}
      title={approach.title}
      description={approach.manifesto}
    >
      <div className="max-w-3xl space-y-6">
        <ApproachCycleDiagram />

        <a
          href={principlesSection.ctaHref}
          onClick={scrollToSystems}
          className="link-underline inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
        >
          {principlesSection.cta}
          <ArrowRight size={14} aria-hidden />
        </a>
      </div>
    </Section>
  );
}
