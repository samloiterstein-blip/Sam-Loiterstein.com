import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { insights, type InsightDraft } from "@/data/content";

const tagColor: Record<InsightDraft["tag"], string> = {
  Product: "bg-sage-50 text-sage-800 border-sage-200",
  Operations: "bg-amber-50 text-amber-800 border-amber-200",
  GTM: "bg-ink-50 text-ink-700 border-ink-200",
  Strategy: "bg-sage-100 text-sage-900 border-sage-300",
};

export function Blog() {
  return (
    <section id="insights" className="py-24 sm:py-28 lg:py-32">
      <div className="container-page">
        <div className="mb-10 max-w-3xl">
          <span className="eyebrow">{insights.eyebrow}</span>
          <h2 className="heading mt-5">{insights.title}</h2>
          <p className="subheading">{insights.description}</p>
        </div>

        <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
          {insights.drafts.map((d, i) => (
            <motion.li
              key={d.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                disabled
                aria-disabled
                className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-sage-50/40 disabled:cursor-default disabled:hover:bg-transparent"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tagColor[d.tag]}`}
                    >
                      {d.tag}
                    </span>
                    <span className="text-xs uppercase tracking-[0.14em] text-ink-400">
                      {d.date}
                    </span>
                  </div>
                  <div className="mt-2 font-display text-lg text-ink-900 sm:text-xl">
                    {d.title}
                  </div>
                </div>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-ink-300 transition-colors group-hover:text-sage-600"
                />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
