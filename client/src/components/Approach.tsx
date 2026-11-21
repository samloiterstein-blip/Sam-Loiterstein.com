import { useId, useRef, useState } from "react";
import { Section } from "./ui/Section";
import { SectionCta } from "./SectionCta";
import {
  approach,
  approachTabs,
  background,
  type ApproachTab,
  type ApproachTabId,
  type CredentialGroupId,
} from "@/data/content";
import { cn } from "@/lib/cn";

function ProofCard({
  title,
  detail,
  logoSrc,
}: {
  title: string;
  detail: string;
  logoSrc?: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-3 py-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-cream">
        {logoSrc ? <img src={logoSrc} alt="" className="h-6 w-6 object-contain" /> : null}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm leading-snug text-ink-900">{title}</span>
        <span className="mt-0.5 block text-xs leading-snug text-ink-600">{detail}</span>
      </span>
    </li>
  );
}

function itemsForGroup(id: CredentialGroupId) {
  if (id === "education") {
    return background.education.map((item) => ({
      key: item.org,
      title: item.title,
      detail: `${item.org}. ${item.period}.`,
      logoSrc: item.logoSrc,
    }));
  }
  if (id === "certifications") {
    return background.credentials.map((item) => ({
      key: item.title,
      title: item.title,
      detail: item.issuer,
      logoSrc: item.logoSrc,
    }));
  }
  return background.experience.map((item) => ({
    key: `${item.org}-${item.title}`,
    title: item.title,
    detail: `${item.org}. ${item.period}.`,
    logoSrc: item.logoSrc,
  }));
}

function CredentialRecord({ tab }: { tab: ApproachTab }) {
  const groups = tab.record ?? [];
  return (
    <div className="mt-8 space-y-7">
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-sage-800">{group.label}</h3>
          <p className="mt-1 text-sm text-ink-600">{group.hint}</p>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {itemsForGroup(group.id).map((item) => (
              <ProofCard key={item.key} title={item.title} detail={item.detail} logoSrc={item.logoSrc} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Points({ tab }: { tab: ApproachTab }) {
  const points = tab.points ?? [];
  if (points.length === 0) return null;

  if (tab.pointsLayout === "grid") {
    return (
      <div className="mt-8">
        {tab.pointsTitle ? (
          <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-sage-800">{tab.pointsTitle}</h3>
        ) : null}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <li key={point.title} className="rounded-2xl border border-ink-100 bg-white px-4 py-4">
              <p className="font-display text-lg text-ink-900">{point.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-3xl">
      {tab.pointsTitle ? (
        <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-sage-800">{tab.pointsTitle}</h3>
      ) : null}
      <ol className="mt-4 space-y-4">
        {points.map((point, index) => (
          <li key={point.title} className="flex gap-3.5 text-sm">
            <span
              aria-hidden
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sage-100 text-xs font-medium text-sage-800"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="font-display text-[1.05rem] leading-snug text-ink-900">{point.title}</p>
              <p className="mt-1 leading-relaxed text-ink-600">{point.body}</p>
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
      <h3 className="max-w-3xl font-display text-2xl leading-snug text-ink-900 sm:text-[1.7rem]">{tab.headline}</h3>
      <div className="mt-4 max-w-3xl space-y-3">
        {tab.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-ink-600 sm:text-[0.95rem]">
            {paragraph}
          </p>
        ))}
      </div>
      {tab.record ? <CredentialRecord tab={tab} /> : null}
      <Points tab={tab} />
      {tab.closing ? (
        <p className="mt-6 max-w-3xl rounded-2xl border border-sage-200/80 bg-sage-50/70 px-4 py-3 text-sm leading-relaxed text-ink-800">
          {tab.closing}
        </p>
      ) : null}
    </div>
  );
}

export function Approach() {
  const [activeId, setActiveId] = useState<ApproachTabId>("credentials");
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
          aria-label="Approach: background, how I work, security, scalability, and responsible AI"
          className="flex flex-wrap gap-2 border-b border-ink-100/90 pb-4"
        >
          {approachTabs.map((tab, index) => {
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
                <span className="mr-1.5 text-[10px] tracking-[0.12em] opacity-70">
                  {String(index + 1).padStart(2, "0")}
                </span>
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
      <SectionCta place="approach" />
    </Section>
  );
}
