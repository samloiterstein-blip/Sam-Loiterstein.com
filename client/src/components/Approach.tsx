import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "./ui/Section";
import { approach, principles, principlesSection, site } from "@/data/content";

export function Approach() {
  const sources = useMemo(() => approach.headshot.sources, []);
  const [attempt, setAttempt] = useState(0);
  const activeSrc = attempt < sources.length ? sources[attempt] : null;

  const scrollToWork = (slug: string) => {
    const el = document.getElementById(`work-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-2", "ring-sage-400", "ring-offset-2");
      window.setTimeout(() => el.classList.remove("ring-2", "ring-sage-400", "ring-offset-2"), 2000);
    }
  };

  return (
    <Section
      id="approach"
      eyebrow={approach.eyebrow}
      title={approach.title}
      description={approach.manifesto}
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-sage-100 via-cream to-sage-50 shadow-soft">
            {activeSrc ? (
              <img
                key={activeSrc}
                src={activeSrc}
                alt={approach.headshot.alt}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={() => setAttempt((i) => i + 1)}
                className="relative z-0 h-full w-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-sage-300/60 bg-white/60 text-sage-800 shadow-soft backdrop-blur">
                  <span className="font-display text-3xl font-medium">{site.initials}</span>
                </div>
              </div>
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/40 to-transparent"
            />
          </div>
        </motion.div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
            {principlesSection.title}
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-2xl border border-ink-100 bg-white/60 p-4 backdrop-blur transition hover:border-sage-300 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sage-100 text-sage-800 transition group-hover:bg-sage-700 group-hover:text-cream">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-lg text-ink-900">{p.title}</div>
                      <p className="mt-1 text-xs font-medium text-sage-800">{p.stakes}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.body}</p>
                      <button
                        type="button"
                        onClick={() => scrollToWork(p.workSlug)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sage-800 transition hover:text-sage-900"
                      >
                        See in practice
                        <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>

          <div className="mt-8 rounded-2xl border border-ink-100 bg-white/70 p-5 shadow-soft">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
              {approach.builtAt.label}
            </div>
            <ul className="mt-4 flex flex-wrap gap-3">
              {approach.builtAt.orgs.map((org) => (
                <li key={org.name}>
                  {"href" in org && org.href ? (
                    <a
                      href={org.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-2.5 rounded-xl border border-ink-100 bg-cream/50 px-3 py-2 transition hover:border-sage-300 hover:bg-white"
                    >
                      <OrgMark org={org} />
                      <span className="text-sm font-medium text-ink-800 group-hover:text-sage-800">
                        {org.name}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-cream/50 px-3 py-2">
                      <OrgMark org={org} />
                      <span className="text-sm font-medium text-ink-800">{org.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

function OrgMark({ org }: { org: (typeof approach.builtAt.orgs)[number] }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-100 bg-white p-1">
      <img src={org.logoSrc} alt="" className="h-full w-full object-contain" loading="lazy" />
    </span>
  );
}
