import { useCallback, useEffect, useRef, useState } from "react";
import { Section } from "./ui/Section";
import { CaseStudyPanel } from "./CaseStudyPanel";
import { site, systemDisplayTitle, workSection, workSystems, type ProofType, type WorkSystem } from "@/data/content";

const featuredOrder = ["jambase-sdr", "partner-map", "linkedin-voice"] as const;
const moreOrder = ["revops-classification", "genre-intelligence", "synth", "nexus", "sustainable-ai"] as const;

function bySlug(slug: string): WorkSystem | undefined {
  return workSystems.find((system) => system.slug === slug);
}

function proofHref(system: WorkSystem, proofType: ProofType): string | undefined {
  if (proofType === "live-product" || proofType === "external-project" || proofType === "article") {
    return system.liveUrl;
  }
  if (proofType === "research" || proofType === "case-study") {
    return system.caseStudyPath;
  }
  return undefined;
}

function isExternalProof(proofType: ProofType): boolean {
  return proofType === "live-product" || proofType === "external-project" || proofType === "article";
}

function ProofLink({
  system,
  proofType,
  label,
  prominent = false,
}: {
  system: WorkSystem;
  proofType: ProofType;
  label: string;
  prominent?: boolean;
}) {
  const href = proofHref(system, proofType);
  if (!href) return null;
  const external = isExternalProof(proofType);
  const className = prominent
    ? "inline-flex items-center rounded-full bg-sage-700 px-4 py-2 text-sm font-medium text-cream transition hover:bg-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
    : "text-sm font-medium text-sage-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400";
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className={className}>
      {label}
    </a>
  );
}

function CaseCard({ system, visual = false }: { system: WorkSystem; visual?: boolean }) {
  const hp = system.homepage;
  const title = systemDisplayTitle(system);

  return (
    <article
      id={`system-${system.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_4px_24px_-8px_rgba(17,29,22,0.08)]"
    >
      {visual && system.previewSrc ? (
        <img
          src={system.previewSrc}
          alt={system.previewAlt ?? title}
          className="h-auto w-full object-contain object-left lg:max-h-20"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-sage-800">{hp.statusLabel}</p>
        <h3 className="mt-1 font-display text-xl leading-snug text-ink-900">{title}</h3>
        <p className="mt-2 text-xs leading-snug text-ink-700">{hp.cardDescription}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <ProofLink system={system} proofType={hp.proofType} label={hp.proofLabel} prominent />
          {hp.secondaryProofType && hp.secondaryProofLabel ? (
            <ProofLink
              system={system}
              proofType={hp.secondaryProofType}
              label={hp.secondaryProofLabel}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function SystemsSection() {
  const [panel, setPanel] = useState<WorkSystem | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const featured = featuredOrder.map(bySlug).filter((system): system is WorkSystem => Boolean(system));
  const more = moreOrder.map(bySlug).filter((system): system is WorkSystem => Boolean(system));

  const closePanel = useCallback(() => setPanel(null), []);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("system");
    if (!slug) return;
    const system = workSystems.find((item) => item.slug === slug);
    if (!system) return;
    setPanel(system);
    window.setTimeout(() => {
      document.getElementById(`system-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, []);

  return (
    <Section id="work" className="lg:!py-4">
      <header className="mb-4">
        <span className="eyebrow">{workSection.eyebrow}</span>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tightish text-ink-900">{workSection.title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-snug text-ink-600">{workSection.description}</p>
      </header>
      <ul className="grid list-none gap-4 lg:grid-cols-3">
        {featured.map((system) => (
          <li key={system.slug} className="min-w-0">
            <CaseCard system={system} visual={system.slug === "partner-map"} />
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <h3 className="font-display text-xl text-ink-900">{workSection.alsoLabel}</h3>
        <ul className="mt-2 divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
          {more.map((system) => {
            const href = system.caseStudyPath ?? system.liveUrl;
            const external = Boolean(system.liveUrl && href === system.liveUrl);
            return (
              <li key={system.slug} id={`system-${system.slug}`} className="grid gap-1 px-4 py-2 lg:grid-cols-[8rem_16rem_minmax(0,1fr)] lg:items-baseline lg:gap-4">
                <span className="w-36 shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-sage-800">
                  {system.homepage.statusLabel ?? system.homepage.competencyLabel}
                </span>
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="font-medium text-ink-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
                  >
                    {systemDisplayTitle(system)}
                  </a>
                ) : (
                  <span className="font-medium text-ink-900">{systemDisplayTitle(system)}</span>
                )}
                <span className="text-xs leading-snug text-ink-600">{system.homepage.cardDescription}</span>
              </li>
            );
          })}
          <li className="grid gap-1 px-4 py-2 lg:grid-cols-[8rem_16rem_minmax(0,1fr)] lg:items-baseline lg:gap-4">
            <span className="w-36 shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-sage-800">Code</span>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
            >
              GitHub
            </a>
            <span className="text-sm text-ink-600 sm:ml-auto">Public repositories.</span>
          </li>
        </ul>
      </div>

      <CaseStudyPanel system={panel} onClose={closePanel} returnFocusRef={triggerRef} />
    </Section>
  );
}
