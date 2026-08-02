import { useState } from "react";
import { cn } from "@/lib/cn";
import { DemoFrame } from "./DemoFrame";

type Focus = "strategy" | "ops" | "gtm";

const engagements: Record<
  Focus,
  { title: string; playbook: string; outcome: string; stat: string }
> = {
  strategy: {
    title: "Strategy sprint",
    playbook: "Market sizing, ICP definition, and executive-ready narrative in 2–3 weeks.",
    outcome: "Clear GTM focus before you hire or spend.",
    stat: "20+ clients",
  },
  ops: {
    title: "Operations build",
    playbook: "Analyst cohort training, delivery playbooks, and QA rails that scale.",
    outcome: "Repeatable project systems without a full internal bench.",
    stat: "200+ analysts trained",
  },
  gtm: {
    title: "GTM acceleration",
    playbook: "Pipeline diagnostics, enablement, and RevOps recommendations tied to forecast.",
    outcome: "Sales motion aligned to segments that actually convert.",
    stat: "Multi-client delivery",
  },
};

const focusOptions: { value: Focus; label: string }[] = [
  { value: "strategy", label: "Strategy" },
  { value: "ops", label: "Operations" },
  { value: "gtm", label: "GTM" },
];

export function NexusEngagementMatcher() {
  const [focus, setFocus] = useState<Focus>("ops");
  const match = engagements[focus];

  return (
    <DemoFrame>
      <div className="w-full max-w-[280px] space-y-4">
        <p className="text-center text-[10px] uppercase tracking-wider text-ink-400">
          What are you working through?
        </p>

        <div className="grid grid-cols-3 gap-1.5">
          {focusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFocus(opt.value)}
              className={cn(
                "rounded-lg py-2 text-[10px] font-medium transition",
                focus === opt.value ? "bg-ink-900 text-cream" : "bg-ink-50 text-ink-500 hover:text-ink-700"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-ink-100 bg-white/80 p-3 text-center">
          <div className="font-display text-base text-ink-900">{match.title}</div>
          <p className="mt-2 text-xs leading-relaxed text-ink-600">{match.playbook}</p>
          <p className="mt-2 text-[10px] font-medium text-ink-800">{match.outcome}</p>
          <div className="mt-3 font-mono text-[10px] text-ink-400">{match.stat}</div>
        </div>

        <a
          href="https://nxsconsultants.com"
          target="_blank"
          rel="noreferrer"
          className="block text-center text-xs font-medium text-[var(--brand-accent)] transition hover:opacity-80"
        >
          nxsconsultants.com →
        </a>
      </div>
    </DemoFrame>
  );
}

/** @deprecated Use NexusEngagementMatcher */
export const NexusScale = NexusEngagementMatcher;
