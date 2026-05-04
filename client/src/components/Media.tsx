import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "./ui/Section";
import { media, mediaSection, type MediaItem } from "@/data/content";

const typeColor: Record<MediaItem["type"], string> = {
  Article: "bg-sage-50 text-sage-800 border-sage-200",
  Podcast: "bg-amber-50 text-amber-800 border-amber-200",
  Mention: "bg-ink-50 text-ink-700 border-ink-200",
  Interview: "bg-sage-100 text-sage-900 border-sage-300",
};

export function Media() {
  return (
    <Section
      id="media"
      eyebrow={mediaSection.eyebrow}
      title={mediaSection.title}
      description={mediaSection.description}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {media.map((m, i) => {
          const Wrapper = m.href ? motion.a : motion.div;
          const linkProps = m.href
            ? { href: m.href, target: "_blank", rel: "noreferrer" }
            : {};

          return (
            <Wrapper
              key={m.outlet + m.title}
              {...(linkProps as object)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 hover:border-sage-300 hover:shadow-[0_12px_32px_-12px_rgba(35,54,42,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${typeColor[m.type]}`}
                >
                  {m.type}
                </span>
                {m.date && <span className="text-xs text-ink-400">{m.date}</span>}
              </div>

              <div className="mt-4 text-xs uppercase tracking-[0.16em] text-ink-500">{m.outlet}</div>
              <h3 className="mt-1.5 font-display text-lg text-ink-900 sm:text-xl">{m.title}</h3>

              {m.href && (
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-sage-800">
                  Read
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>
    </Section>
  );
}
