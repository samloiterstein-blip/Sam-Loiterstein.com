import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { services, servicesSection } from "@/data/content";

export function Services() {
  return (
    <Section
      id="services"
      eyebrow={servicesSection.eyebrow}
      title={servicesSection.title}
      description={servicesSection.description}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-soft transition-all duration-300 hover:border-sage-300 hover:shadow-[0_12px_32px_-12px_rgba(35,54,42,0.18)]"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sage-100 text-sage-800 transition-colors duration-300 group-hover:bg-sage-700 group-hover:text-cream">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink-900 sm:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.description}</p>
                </div>
              </div>

              <ul className="mt-6 grid gap-2 border-t border-ink-100 pt-5 sm:grid-cols-3">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-ink-700"
                  >
                    <Check size={14} className="text-sage-700" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sage-200 bg-sage-50/60 p-6">
        <div>
          <div className="font-display text-xl text-ink-900">{servicesSection.ctaPrompt}</div>
          <p className="mt-1 text-sm text-ink-600">{servicesSection.ctaSubcopy}</p>
        </div>
        <Button
          as="a"
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {servicesSection.ctaButton}
          <ArrowRight size={16} />
        </Button>
      </div>
    </Section>
  );
}
