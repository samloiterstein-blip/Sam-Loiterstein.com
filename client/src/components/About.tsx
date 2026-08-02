import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "./ui/Section";
import { about, site } from "@/data/content";

export function About() {
  const sources = useMemo(() => about.headshot.sources, []);
  const [attempt, setAttempt] = useState(0);

  const activeSrc = attempt < sources.length ? sources[attempt] : null;

  return (
    <Section
      id="about"
      eyebrow={about.eyebrow}
      title={about.title}
      description={about.bioParagraphs[0]}
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
                alt={about.headshot.alt}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={() => setAttempt((i) => i + 1)}
                className="relative z-0 h-full w-full object-cover object-center"
              />
            ) : (
              <>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(63,98,74,0.18),transparent_55%)]"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-sage-300/60 bg-white/60 text-sage-800 shadow-soft backdrop-blur">
                    <span className="font-display text-3xl font-medium">{site.initials}</span>
                  </div>
                </div>
              </>
            )}

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/40 to-transparent"
            />
          </div>
        </motion.div>

        <div>
          <div className="space-y-5 text-base leading-relaxed text-ink-700 sm:text-[17px]">
            {about.bioParagraphs.slice(1).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-ink-100 bg-white/70 p-5 shadow-soft">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
              {about.builtAt.label}
            </div>
            <ul className="mt-4 flex flex-wrap gap-3">
              {about.builtAt.orgs.map((org) => (
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

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {about.narrativeThreads.map((thread, i) => (
              <motion.li
                key={thread.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-ink-100 bg-white/60 p-4 backdrop-blur"
              >
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-sage-800">
                  {thread.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{thread.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function OrgMark({ org }: { org: (typeof about.builtAt.orgs)[number] }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-100 bg-white p-1">
      <img src={org.logoSrc} alt="" className="h-full w-full object-contain" loading="lazy" />
    </span>
  );
}
