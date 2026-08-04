import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import type { RefObject } from "react";
import { systemDisplayTitle, type WorkSystem } from "@/data/content";
import { Tag } from "./ui/Tag";

type CaseStudyPanelProps = {
  system: WorkSystem | null;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function CaseStudyPanel({
  system,
  onClose,
  returnFocusRef,
}: CaseStudyPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!system) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      returnFocusRef?.current?.focus();
    };
  }, [system, onClose, returnFocusRef]);

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
            tabIndex={-1}
            className="fixed inset-0 z-50 bg-ink-900/30 backdrop-blur-sm"
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto border-l border-ink-100 bg-cream shadow-soft"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink-100 bg-cream/95 px-6 py-4 backdrop-blur">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-sage-800">
                  {system.homepage.competencyLabel}
                </p>
                <div className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-500">{system.year}</div>
                <h2 id={titleId} className="mt-1 font-display text-2xl text-ink-900">
                  {systemDisplayTitle(system)}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-700 hover:border-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-8 p-6">
              <p className="text-sm leading-relaxed text-ink-700">{system.stakes}</p>

              <section aria-labelledby={`${titleId}-narrative`} className="space-y-5 rounded-2xl border border-ink-100/80 bg-white/70 p-5">
                <h3 id={`${titleId}-narrative`} className="sr-only">
                  Case narrative
                </h3>
                <CaseBlock label="Problem" text={system.problem} />
                <CaseBlock label="Approach" text={system.approach} />
                <CaseBlock label="Outcome" text={system.outcome} />
              </section>

              {system.constraints ? (
                <section className="rounded-xl border border-sage-200 bg-sage-50/60 p-4">
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage-800">
                    Constraints
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{system.constraints}</p>
                </section>
              ) : null}

              {system.caseStudyImages?.length ? (
                <section aria-labelledby={`${titleId}-visuals`} className="space-y-4">
                  <h3
                    id={`${titleId}-visuals`}
                    className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500"
                  >
                    System overview
                  </h3>
                  {system.caseStudyImages.map((image) => (
                    <figure key={image.src} className="overflow-hidden rounded-2xl border border-ink-100/80 bg-white">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full"
                        loading="lazy"
                        decoding="async"
                      />
                      {image.caption ? (
                        <figcaption className="border-t border-ink-100/80 px-4 py-3 text-xs leading-relaxed text-ink-600">
                          {image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </section>
              ) : null}

              {system.drawerSections?.map((section) => (
                <section key={section.heading}>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">
                    {section.heading}
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-700">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage-600" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <section>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">Stack</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {system.stack.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </section>

              {system.caseStudyPath ? (
                <div className="border-t border-ink-100/80 pt-2">
                  <a
                    href={system.caseStudyPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
                  >
                    Read full write-up
                    <ArrowUpRight size={14} aria-hidden />
                  </a>
                </div>
              ) : null}
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
      <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">{label}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{text}</p>
    </div>
  );
}
