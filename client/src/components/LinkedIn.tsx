import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin, MapPin, Users } from "lucide-react";
import { linkedin } from "@/data/content";

export function LinkedIn() {
  return (
    <section className="py-10">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
          className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition-shadow duration-300 hover:shadow-[0_12px_40px_-10px_rgba(35,54,42,0.18)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-sage-700 via-sage-600 to-sage-500"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sage-200/40 blur-3xl"
          />

          <div className="relative p-6 pt-14 sm:p-8 sm:pt-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-start gap-5">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-cream shadow-soft sm:h-28 sm:w-28">
                  <img
                    src={linkedin.photoSrc}
                    alt={linkedin.photoAlt}
                    className="h-full w-full scale-120 object-cover object-[52%_20%]"
                    loading="lazy"
                  />
                </div>

                <div className="pt-2">
                  <div className="text-xs uppercase tracking-[0.16em] text-cream/90">
                    {linkedin.eyebrow}
                  </div>
                  <div className="mt-1 font-display text-2xl text-ink-900 sm:text-3xl">
                    {linkedin.name}
                  </div>
                  <div className="mt-1 max-w-lg text-sm leading-relaxed text-ink-600">
                    {linkedin.tagline}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} />
                      {linkedin.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={12} />
                      {linkedin.status}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={linkedin.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-sage-700 px-5 text-sm font-medium text-cream shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_4px_16px_-4px_rgba(35,54,42,0.35)] transition-all duration-200 hover:bg-sage-800 active:scale-[0.98] sm:self-end"
              >
                <Linkedin size={16} />
                {linkedin.buttonLabel}
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
