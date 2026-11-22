import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
        {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-ink-100 bg-white p-7 shadow-soft"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-sage-800">{s.audience}</p>
              <h3 className="mt-1 font-display text-xl text-ink-900 sm:text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.problem}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-800">{s.proof}</p>
            </motion.div>
          ))}
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
