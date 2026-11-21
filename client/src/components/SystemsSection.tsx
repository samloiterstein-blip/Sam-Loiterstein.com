import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Section } from "./ui/Section";
import { Tag } from "./ui/Tag";
import { CaseStudyPanel } from "./CaseStudyPanel";
import { SectionCta } from "./SectionCta";
import { GitRepos } from "./GitRepos";
import {
  founderWorkSystems,
  fractionalExpertiseSection,
  fractionalExpertiseSystems,
  portfolioTabs,
  systemDisplayTitle,
  systemIndex,
  systemIndexSection,
  workSection,
  workSystems,
  type PortfolioTabId,
  type ProofType,
  type WorkSystem,
} from "@/data/content";
import { cn } from "@/lib/cn";

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

function tabForSlug(slug: string): PortfolioTabId {
  if (founderWorkSystems.some((system) => system.slug === slug)) return "founder";
  if (fractionalExpertiseSystems.some((system) => system.slug === slug)) return "fractional";
  if (systemIndex.some((system) => system.slug === slug)) return "projects";
  return "founder";
}

export function SystemsSection() {
  const [panel, setPanel] = useState<PanelState | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<PortfolioTabId>(() => {
    if (typeof window === "undefined") return "founder";
    const slug = new URLSearchParams(window.location.search).get("system");
    return slug ? tabForSlug(slug) : "founder";
  });
  const baseId = useId();
  const tabRefs = useRef<Partial<Record<PortfolioTabId, HTMLButtonElement | null>>>({});

  const selectTab = (id: PortfolioTabId) => {
    setActiveTab(id);
    queueMicrotask(() => tabRefs.current[id]?.focus());
  };

  const scrollToSystem = useCallback((slug: string) => {
    document.getElementById(`system-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
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

    setActiveTab(tabForSlug(slug));
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
    >
      <div
        role="tablist"
        aria-label="Portfolio: founder work, fractional and intern experience, projects, and GitHub"
        className="flex flex-wrap gap-2"
      >
        {portfolioTabs.map((tab) => {
          const selected = tab.id === activeTab;
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
                const currentIndex = portfolioTabs.findIndex((item) => item.id === activeTab);
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const delta = event.key === "ArrowRight" ? 1 : -1;
                  const next = portfolioTabs[(currentIndex + delta + portfolioTabs.length) % portfolioTabs.length];
                  selectTab(next.id);
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  selectTab(portfolioTabs[0].id);
                }
                if (event.key === "End") {
                  event.preventDefault();
                  selectTab(portfolioTabs[portfolioTabs.length - 1].id);
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

      <div
        id={`${baseId}-${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${activeTab}-tab`}
        className="mt-6"
      >
        {activeTab === "founder" ? (
          <FeaturedSystemsGrid systems={founderWorkSystems} onActivate={openPanel} />
        ) : null}
        {activeTab === "fractional" ? (
          <div>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink-600">{fractionalExpertiseSection.description}</p>
            <FeaturedSystemsGrid systems={fractionalExpertiseSystems} onActivate={openPanel} />
          </div>
        ) : null}
        {activeTab === "projects" ? (
          <div>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink-600">{systemIndexSection.description}</p>
            <FeaturedSystemsGrid systems={systemIndex} onActivate={openPanel} />
          </div>
        ) : null}
        {activeTab === "git" ? <GitRepos /> : null}
      </div>

      <SectionCta place="work" />

      <CaseStudyPanel
        system={panel}
        onClose={closePanel}
        returnFocusRef={triggerRef}
      />
    </Section>
  );
}
