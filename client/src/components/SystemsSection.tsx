import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "./ui/Section";
import { Tag } from "./ui/Tag";
import { CaseStudyPanel } from "./CaseStudyPanel";
import {
  founderWorkSection,
  founderWorkSystems,
  fractionalExpertiseSection,
  fractionalExpertiseSystems,
  systemDisplayTitle,
  systemIndex,
  systemIndexSection,
  workSection,
  workSystems,
  type ProofType,
  type WorkSystem,
} from "@/data/content";

type PanelState = WorkSystem | null;

function proofOpensPanel(proofType: ProofType): boolean {
  return proofType === "case-study" || proofType === "research";
}

function proofExternalUrl(system: WorkSystem, proofType: ProofType): string | undefined {
  if (proofType === "live-product" || proofType === "external-project" || proofType === "article") {
    return system.liveUrl;
  }
  if (proofType === "research" || proofType === "case-study") {
    return system.caseStudyPath;
  }
  return undefined;
}

function SystemMedia({ system }: { system: WorkSystem }) {
  const brandStyle = {
    "--brand-accent": system.brand.accent,
    "--brand-surface": system.brand.surface,
  } as CSSProperties;

  if (system.slug === "synth") {
    return (
      <div
        style={brandStyle}
        className="flex h-full w-full items-center justify-center bg-[linear-gradient(165deg,#fff8fb,#ffe5f0)] p-6"
      >
        {system.logoSrc ? (
          <img
            src={system.logoSrc}
            alt=""
            className="h-16 w-16 object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
    );
  }

  if (system.previewSrc) {
    return (
      <img
        src={system.previewSrc}
        alt={system.previewAlt ?? systemDisplayTitle(system)}
        className="h-full w-full object-cover object-top"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div
      style={brandStyle}
      className="flex h-full w-full items-center justify-center bg-[linear-gradient(165deg,color-mix(in_srgb,var(--brand-surface)_92%,white),#f8f7f2)] p-6"
    >
      {system.logoSrc ? (
        <img
          src={system.logoSrc}
          alt=""
          className="max-h-20 max-w-[70%] object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="font-display text-lg text-ink-700">{systemDisplayTitle(system)}</span>
      )}
    </div>
  );
}

function formatActionLabel(label: string, proofType: ProofType, variant: "primary" | "secondary"): string {
  if (variant === "secondary") return `${label} →`;
  if (proofOpensPanel(proofType)) return `${label} →`;
  return `${label} ↗`;
}

function ProofAction({
  system,
  proofType,
  label,
  variant = "primary",
  onActivate,
}: {
  system: WorkSystem;
  proofType: ProofType;
  label: string;
  variant?: "primary" | "secondary";
  onActivate: (system: WorkSystem, proofType: ProofType, trigger: HTMLElement) => void;
}) {
  const externalUrl = proofExternalUrl(system, proofType);
  const opensPanel = proofOpensPanel(proofType);
  const displayLabel = formatActionLabel(label, proofType, variant);

  const className =
    variant === "primary"
      ? "inline-flex items-center gap-1.5 rounded-full bg-sage-700 px-4 py-2 text-sm font-medium text-cream transition hover:bg-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
      : "link-underline inline-flex items-center gap-1 rounded-sm text-sm font-medium text-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2";

  if (opensPanel) {
    return (
      <button
        type="button"
        onClick={(e) => onActivate(system, proofType, e.currentTarget)}
        className={className}
      >
        {displayLabel}
      </button>
    );
  }

  if (!externalUrl) return null;

  const isExternal = proofType === "live-product" || proofType === "external-project" || proofType === "article";
  return (
    <a
      href={externalUrl}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
      className={className}
    >
      {displayLabel}
    </a>
  );
}

function FeaturedSystemCard({
  system,
  onActivate,
}: {
  system: WorkSystem;
  onActivate: (system: WorkSystem, proofType: ProofType, trigger: HTMLElement) => void;
}) {
  const hp = system.homepage;
  const title = systemDisplayTitle(system);

  return (
    <article
      id={`system-${system.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100/80 bg-white/80 shadow-[0_4px_24px_-8px_rgba(17,29,22,0.08)]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden border-b border-ink-100/80 bg-cream/40">
        <SystemMedia system={system} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-sage-800">
          {hp.competencyLabel}
        </p>
        <h3 className="mt-2 font-display text-xl text-ink-900">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{hp.cardDescription}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hp.displayTags.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="mt-5 flex flex-col items-start gap-3">
          <ProofAction
            system={system}
            proofType={hp.proofType}
            label={hp.proofLabel}
            onActivate={onActivate}
          />
          {hp.secondaryProofType && hp.secondaryProofLabel ? (
            <ProofAction
              system={system}
              proofType={hp.secondaryProofType}
              label={hp.secondaryProofLabel}
              variant="secondary"
              onActivate={onActivate}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SystemIndexAccordionItem({
  system,
  defaultOpen = false,
  onActivate,
}: {
  system: WorkSystem;
  defaultOpen?: boolean;
  onActivate: (system: WorkSystem, proofType: ProofType, trigger: HTMLElement) => void;
}) {
  const hp = system.homepage;
  const title = systemDisplayTitle(system);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (defaultOpen && detailsRef.current) {
      detailsRef.current.open = true;
    }
  }, [defaultOpen]);

  return (
    <li id={`index-${system.slug}`} className="border-b border-ink-100/80 last:border-b-0">
      <details ref={detailsRef} className="group">
        <summary className="flex cursor-pointer list-none items-center gap-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden sm:gap-6">
          <span className="w-12 shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500 sm:w-20">
            {system.year}
          </span>
          <span className="min-w-0 flex-1 font-display text-lg text-ink-900">{title}</span>
          <ChevronDown
            size={16}
            className="shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
            aria-hidden
          />
        </summary>

        <div className="pb-5 pl-16 sm:pl-[6.5rem]">
          <p className="text-sm leading-relaxed text-ink-600">{hp.cardDescription}</p>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-sage-800">
            {hp.competencyLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hp.displayTags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-start gap-2">
            <ProofAction
              system={system}
              proofType={hp.proofType}
              label={hp.proofLabel}
              onActivate={onActivate}
            />
            {hp.secondaryProofType && hp.secondaryProofLabel ? (
              <ProofAction
                system={system}
                proofType={hp.secondaryProofType}
                label={hp.secondaryProofLabel}
                variant="secondary"
                onActivate={onActivate}
              />
            ) : null}
          </div>
        </div>
      </details>
    </li>
  );
}

function FeaturedSystemsGrid({
  systems,
  onActivate,
}: {
  systems: WorkSystem[];
  onActivate: (system: WorkSystem, proofType: ProofType, trigger: HTMLElement) => void;
}) {
  return (
    <ul className="grid list-none gap-6 lg:grid-cols-3">
      {systems.map((system) => (
        <li key={system.slug} className="min-w-0">
          <FeaturedSystemCard system={system} onActivate={onActivate} />
        </li>
      ))}
    </ul>
  );
}

export function SystemsSection() {
  const [panel, setPanel] = useState<PanelState | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [indexOpenSlug] = useState(() => {
    if (typeof window === "undefined") return null;
    const slug = new URLSearchParams(window.location.search).get("system");
    return slug && systemIndex.some((s) => s.slug === slug) ? slug : null;
  });

  const scrollToSystem = useCallback((slug: string) => {
    const el = document.getElementById(`system-${slug}`) ?? document.getElementById(`index-${slug}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openPanel = useCallback(
    (system: WorkSystem, proofType: ProofType, trigger: HTMLElement) => {
      triggerRef.current = trigger;
      if (proofOpensPanel(proofType)) {
        setPanel(system);
      }
    },
    []
  );

  const closePanel = useCallback(() => {
    setPanel(null);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("system");

    if (!slug) return;

    const system = workSystems.find((w) => w.slug === slug);
    if (!system) return;

    setPanel(system);

    if (params.get("music") === "connected") {
      window.history.replaceState({}, "", `${window.location.pathname}#work`);
    }

    window.setTimeout(() => scrollToSystem(slug), 400);
  }, [scrollToSystem]);

  return (
    <Section
      id="work"
      eyebrow={workSection.eyebrow}
      title={workSection.title}
      description={workSection.description}
      className="py-14 sm:py-16 lg:py-20"
    >
      <div>
        <h3 className="font-display text-2xl text-ink-900">{founderWorkSection.title}</h3>
        <div className="mt-6">
          <FeaturedSystemsGrid systems={founderWorkSystems} onActivate={openPanel} />
        </div>
      </div>

      <div className="mt-12 border-t border-ink-100/80 pt-10">
        <h3 className="font-display text-2xl text-ink-900">{fractionalExpertiseSection.title}</h3>
        <div className="mt-6">
          <FeaturedSystemsGrid systems={fractionalExpertiseSystems} onActivate={openPanel} />
        </div>
      </div>

      <div className="mt-12 border-t border-ink-100/80 pt-10">
        <h3 className="font-display text-2xl text-ink-900">{systemIndexSection.title}</h3>
        <p className="subheading mt-2">{systemIndexSection.description}</p>
        <ul className="mt-6 list-none rounded-2xl border border-ink-100/80 bg-white/70 px-5">
          {systemIndex.map((system) => (
            <SystemIndexAccordionItem
              key={system.slug}
              system={system}
              defaultOpen={indexOpenSlug === system.slug}
              onActivate={openPanel}
            />
          ))}
        </ul>
      </div>

      <CaseStudyPanel
        system={panel}
        onClose={closePanel}
        returnFocusRef={triggerRef}
      />
    </Section>
  );
}
