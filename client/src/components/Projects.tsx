import { useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { Section } from "./ui/Section";
import { Tag } from "./ui/Tag";
import { Button } from "./ui/Button";
import {
  featuredProjects,
  featuredProjectsSection,
  pastProjectsSection,
  projects,
  projectsSection,
  services,
  servicesSection,
  type FeaturedProject,
  type Project,
} from "@/data/content";

export function Projects() {
  const [selectedSkill, setSelectedSkill] = useState("All");

  const skillOptions = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags))).sort()],
    []
  );

  const sortedProjects = useMemo(() => {
    if (selectedSkill === "All") return projects;

    return [...projects].sort((a, b) => {
      const aMatch = a.tags.includes(selectedSkill) ? 1 : 0;
      const bMatch = b.tags.includes(selectedSkill) ? 1 : 0;
      return bMatch - aMatch || a.title.localeCompare(b.title);
    });
  }, [selectedSkill]);

  return (
    <Section
      id="projects"
      eyebrow={projectsSection.eyebrow}
      title={projectsSection.title}
      description={projectsSection.description}
    >
      <div className="space-y-10">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-ink-500">
            {featuredProjectsSection.eyebrow}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
            {featuredProjectsSection.description}
          </p>
          <div className="mt-6 space-y-5">
            {featuredProjects.map((p, i) => (
              <FeaturedCaseStudy key={p.title} project={p} index={i} />
            ))}
          </div>
        </div>

        <details className="group rounded-3xl border border-ink-100 bg-white shadow-soft">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="text-xs uppercase tracking-[0.16em] text-ink-500">
              {pastProjectsSection.title}
            </span>
            <ChevronDown
              size={18}
              className="shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
              aria-hidden
            />
          </summary>

          <div className="border-t border-ink-100 px-6 pb-6 pt-5">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <label className="inline-flex items-center gap-2 text-xs text-ink-600">
                <span className="uppercase tracking-[0.12em] text-ink-500">Sort by skill</span>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 outline-none transition focus:border-sage-400"
                >
                  {skillOptions.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {sortedProjects.map((p, i) => (
                <PastProjectCard key={p.title} project={p} index={i} />
              ))}
            </div>
          </div>
        </details>

        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-7">
          <div className="text-xs uppercase tracking-[0.16em] text-ink-500">Services and use cases</div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
            Engagements Sam typically takes on, and where teams usually need support.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-ink-100 bg-cream/60 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sage-100 text-sage-800">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-ink-900">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.description}</p>
                    </div>
                  </div>

                  <ul className="mt-4 grid gap-1.5 text-sm text-ink-700">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <Check size={14} className="text-sage-700" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-sage-200 bg-sage-50/60 p-4">
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
      </div>
    </Section>
  );
}

function FeaturedCaseStudy({ project: p, index: i }: { project: FeaturedProject; index: number }) {
  return (
    <motion.a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={
        {
          "--brand-accent": p.brand.accent,
          "--brand-accent-muted": p.brand.accentMuted,
          "--brand-surface": p.brand.surface,
          "--brand-border": p.brand.border,
          "--brand-tag-bg": p.brand.tagBg,
          "--brand-tag-text": p.brand.tagText,
          "--brand-logo-bg": p.brand.logoBackground ?? "#ffffff",
        } as CSSProperties
      }
      className="group block overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface)] shadow-soft transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[0_16px_40px_-16px_color-mix(in_srgb,var(--brand-accent)_35%,transparent)]"
    >
      <div aria-hidden className="h-1 bg-[var(--brand-accent)]" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-logo-bg)] p-2 shadow-sm">
              <img
                src={p.logoSrc}
                alt={p.logoAlt}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--brand-accent)]">
                {p.year}
              </div>
              <h3 className="font-display text-2xl text-ink-900 sm:text-3xl">{p.title}</h3>
            </div>
          </div>
          <ArrowUpRight
            size={20}
            className="shrink-0 text-ink-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-accent)]"
          />
        </div>

        {p.stats && p.stats.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {p.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--brand-border)] bg-white/70 px-4 py-3"
              >
                <div className="font-display text-2xl text-ink-900">{stat.value}</div>
                <div className="mt-0.5 text-xs uppercase tracking-[0.12em] text-ink-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <CaseBlock label="Problem" text={p.problem} />
          <CaseBlock label="Approach" text={p.approach} />
          <CaseBlock label="Outcome" text={p.outcome} className="md:col-span-2" />
        </div>

        <div className="mt-5">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">
            Stack
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.stack.map((item) => (
              <Tag
                key={item}
                className="border-transparent bg-[var(--brand-tag-bg)] text-[var(--brand-tag-text)]"
              >
                {item}
              </Tag>
            ))}
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-accent)]">
          View project
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.a>
  );
}

function PastProjectCard({ project: p, index: i }: { project: Project; index: number }) {
  const Wrapper = p.href ? motion.a : motion.div;
  const linkProps = p.href ? { href: p.href, target: "_blank", rel: "noreferrer" } : {};

  return (
    <Wrapper
      {...(linkProps as object)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all duration-300 hover:border-sage-300 hover:shadow-[0_12px_32px_-12px_rgba(35,54,42,0.18)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">
            {p.year}
          </div>
          <h3 className="mt-1 font-display text-xl text-ink-900">{p.title}</h3>
        </div>
        {p.href && (
          <ArrowUpRight
            size={18}
            className="shrink-0 text-ink-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage-700"
          />
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-600">{p.description}</p>

      {p.challenge && p.recommendation && p.result && (
        <dl className="mt-4 grid gap-3 text-sm">
          <CaseDetail term="Challenge" detail={p.challenge} />
          <CaseDetail term="Recommendation" detail={p.recommendation} />
          <CaseDetail term="Result" detail={p.result} />
        </dl>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </Wrapper>
  );
}

function CaseBlock({
  label,
  text,
  className,
}: {
  label: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">{label}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{text}</p>
    </div>
  );
}

function CaseDetail({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage-800">{term}</dt>
      <dd className="mt-1 leading-relaxed text-ink-600">{detail}</dd>
    </div>
  );
}
