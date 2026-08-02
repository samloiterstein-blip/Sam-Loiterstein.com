import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import type { WorkSystem } from "@/data/content";
import { Tag } from "./ui/Tag";
import { GenreFeedDemo } from "./demos/GenreFeedDemo";
import { DealClassifierDemo } from "./demos/DealClassifierDemo";
import { SdrBaseDemo } from "./demos/SdrBaseDemo";

type CaseStudyPanelProps = {
  system: WorkSystem | null;
  onClose: () => void;
};

export function CaseStudyPanel({ system, onClose }: CaseStudyPanelProps) {
  return (
    <AnimatePresence>
      {system && (
        <>
          <motion.button
            type="button"
            aria-label="Close case study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink-900/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto border-l border-ink-100 bg-cream shadow-soft"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-cream/95 px-6 py-4 backdrop-blur">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-ink-500">{system.year}</div>
                <h2 className="font-display text-2xl text-ink-900">{system.title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-700 hover:border-sage-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-6 p-6">
              {system.slug === "genre-intelligence" && (
                <GenreFeedDemo />
              )}

              {system.slug === "revops-classification" && (
                <DealClassifierDemo />
              )}

              {system.slug === "jambase-sdr" && (
                <SdrBaseDemo />
              )}

              <p className="text-sm leading-relaxed text-ink-600">{system.stakes}</p>

              {system.constraints && (
                <div className="rounded-xl border border-sage-200 bg-sage-50/60 p-4">
                  <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage-800">
                    Constraints
                  </div>
                  <p className="mt-2 text-sm text-ink-700">{system.constraints}</p>
                </div>
              )}

              <CaseBlock label="Problem" text={system.problem} />
              <CaseBlock label="Approach" text={system.approach} />
              <CaseBlock label="Outcome" text={system.outcome} />

              {system.drawerSections?.map((section) => (
                <div key={section.heading}>
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">
                    {section.heading}
                  </div>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-700">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">
                  Stack
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {system.stack.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {system.liveUrl && (
                  <a
                    href={system.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sage-700 px-4 py-2 text-sm font-medium text-cream hover:bg-sage-800"
                  >
                    Open live
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {system.caseStudyPath && (
                  <a
                    href={system.caseStudyPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-sage-400"
                  >
                    Full case study
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CaseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">{label}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{text}</p>
    </div>
  );
}
