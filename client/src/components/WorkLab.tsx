import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { Section } from "./ui/Section";
import { Tag } from "./ui/Tag";
import { Button } from "./ui/Button";
import { CaseStudyPanel } from "./CaseStudyPanel";
import { WorkDemo } from "./demos/WorkDemo";
import {
  earlierSystems,
  services,
  servicesSection,
  workSection,
  workSystems,
  type WorkSystem,
} from "@/data/content";

export function WorkLab() {
  const [drawerSystem, setDrawerSystem] = useState<WorkSystem | null>(null);

  const featured = useMemo(() => workSystems.filter((w) => w.featured), []);

  const scrollToSystem = useCallback((slug: string) => {
    const el = document.getElementById(`work-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("system");
    const music = params.get("music");

    if (slug === "genre-intelligence" && (music === "connected" || music === "error")) {
      const genre = workSystems.find((w) => w.slug === "genre-intelligence");
      if (genre) setDrawerSystem(genre);
      if (music === "connected") {
        window.history.replaceState({}, "", `${window.location.pathname}#work`);
      }
    }

    if (slug && workSystems.some((w) => w.slug === slug)) {
      window.setTimeout(() => scrollToSystem(slug), 400);
    }
  }, [scrollToSystem]);

  return (
    <Section
      id="work"
      eyebrow={workSection.eyebrow}
      title={workSection.title}
      description={workSection.description}
      className="py-14 sm:py-16 lg:py-20"
      containerClassName="[&_header]:mb-8 [&_header]:sm:mb-10 [&_.heading]:text-3xl [&_.heading]:sm:text-4xl [&_.subheading]:text-base"
    >
      <div className="relative -mx-6 sm:-mx-8 lg:-mx-10">
        <div
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-6 scroll-smooth pb-2 pt-1 sm:gap-8 sm:px-8 lg:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Interactive system demos"
        >
          {featured.map((system, i) => (
            <SystemPortal
              key={system.slug}
              system={system}
              index={i}
              onOpenDrawer={() => setDrawerSystem(system)}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-cream to-transparent sm:w-12"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-cream to-transparent sm:w-12"
        />
      </div>

      <details className="group mt-10 rounded-2xl border border-ink-100/80 bg-white/80 shadow-[0_4px_24px_-8px_rgba(17,29,22,0.08)] backdrop-blur-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
            {workSection.earlierTitle}
          </span>
          <ChevronDown
            size={16}
            className="shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-ink-100/80 px-5 pb-5 pt-4">
          <div className="grid gap-3 lg:grid-cols-2">
            {earlierSystems.map((p, i) => (
              <EarlierCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </details>

      <div className="mt-8 rounded-2xl border border-ink-100/80 bg-white/80 p-5 shadow-[0_4px_24px_-8px_rgba(17,29,22,0.08)] backdrop-blur-sm sm:p-6">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
          {workSection.engagementsEyebrow}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
          {workSection.engagementsBody}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl border border-ink-100/80 bg-cream/50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sage-100 text-sage-800">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-ink-900">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.description}</p>
                  </div>
                </div>
                <ul className="mt-3 grid gap-1 text-sm text-ink-700">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <Check size={13} className="text-sage-700" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 rounded-xl border border-sage-200/80 bg-sage-50/50 p-4">
          <div className="font-display text-lg text-ink-900">{servicesSection.ctaPrompt}</div>
          <p className="mt-1 text-sm text-ink-600">{servicesSection.ctaSubcopy}</p>
          <Button
            as="a"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-3"
          >
            {servicesSection.ctaButton}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <CaseStudyPanel system={drawerSystem} onClose={() => setDrawerSystem(null)} />
    </Section>
  );
}

function SystemPortal({
  system,
  index,
  onOpenDrawer,
}: {
  system: WorkSystem;
  index: number;
  onOpenDrawer: () => void;
}) {
  const brandStyle = {
    "--brand-accent": system.brand.accent,
    "--brand-surface": system.brand.surface,
    "--brand-logo-bg": system.brand.logoBackground ?? "#ffffff",
  } as CSSProperties;

  return (
    <motion.article
      id={`work-${system.slug}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={brandStyle}
      className="group flex w-[min(94vw,880px)] shrink-0 snap-center scroll-ml-6 flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-soft ring-1 ring-ink-900/[0.07] sm:w-[min(88vw,820px)] lg:w-[min(calc(100vw-5rem),860px)]"
    >
      {/* Interactive portal — fixed height so footer + demo stay predictable */}
      <div
        className="relative flex h-[min(420px,58vw)] min-h-[340px] max-h-[440px] flex-col overflow-hidden sm:h-[400px]"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, var(--brand-surface) 90%, white) 0%, color-mix(in srgb, var(--brand-accent) 4%, #f8f7f2) 100%)`,
        }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink-100/60 bg-white/50 px-3 py-2 backdrop-blur-sm sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {system.logoSrc && (
              <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-1 ring-1 ring-ink-900/[0.06]">
                <img
                  src={system.logoSrc}
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-medium text-ink-900">{system.title}</p>
              <p className="text-[10px] text-ink-500">Live demo · scroll and interact</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenDrawer}
            className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium text-ink-600 ring-1 ring-ink-200/90 transition hover:bg-white hover:text-ink-900"
          >
            Case study
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden p-2 sm:p-2.5">
          {system.demo ? (
            <WorkDemo system={system} variant="portal" />
          ) : (
            <p className="flex h-full items-center justify-center px-6 text-center text-sm text-ink-600">
              {system.brief}
            </p>
          )}
        </div>
      </div>

      {/* Description footer */}
      <footer className="shrink-0 border-t border-ink-100/80 bg-cream/30 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: system.brand.accent }}
              />
              <span className="text-xs font-medium text-ink-500">{system.year}</span>
            </div>
            <h3 className="mt-1 font-display text-xl tracking-tight text-ink-900 sm:text-2xl">
              {system.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink-600">
              {system.stakes}
            </p>
            {system.brief && (
              <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink-500">
                {system.brief}
              </p>
            )}
          </div>
          {system.liveUrl && (
            <a
              href={system.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink-900 px-4 py-2 text-xs font-medium text-cream transition hover:bg-ink-800"
            >
              Live product
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {system.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      </footer>
    </motion.article>
  );
}

function EarlierCard({
  project: p,
  index: i,
}: {
  project: (typeof earlierSystems)[number];
  index: number;
}) {
  const Wrapper = p.href ? motion.a : motion.div;
  const linkProps = p.href ? { href: p.href, target: "_blank", rel: "noreferrer" } : {};

  return (
    <Wrapper
      {...(linkProps as object)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-xl border border-ink-100/80 bg-white/70 p-4 transition hover:border-sage-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500">
            {p.year}
          </div>
          <h3 className="mt-0.5 font-display text-lg text-ink-900">{p.title}</h3>
        </div>
        {p.href && (
          <ArrowUpRight
            size={16}
            className="shrink-0 text-ink-400 transition group-hover:text-sage-700"
          />
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.description}</p>
      <dl className="mt-3 grid gap-2 text-sm">
        <CaseDetail term="Challenge" detail={p.challenge} />
        <CaseDetail term="Recommendation" detail={p.recommendation} />
        <CaseDetail term="Result" detail={p.result} />
      </dl>
      <div className="mt-3 flex flex-wrap gap-1">
        {p.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </Wrapper>
  );
}

function CaseDetail({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-sage-800">{term}</dt>
      <dd className="mt-0.5 leading-relaxed text-ink-600">{detail}</dd>
    </div>
  );
}
