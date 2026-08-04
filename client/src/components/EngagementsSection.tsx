import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { engagementsSection, services, servicesSection } from "@/data/content";

export function EngagementsSection() {
  return (
    <Section
      id="engagements"
      eyebrow={servicesSection.eyebrow}
      title={servicesSection.title}
      description={engagementsSection.description}
      className="py-14 sm:py-16 lg:py-20"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-ink-100/80 bg-white/70 p-4 backdrop-blur-sm sm:p-5"
            >
              <div className="flex items-start gap-3">
                <div
                  aria-hidden
                  className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sage-100 text-sage-800"
                >
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
                    <Check size={13} className="shrink-0 text-sage-700" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-sage-200/80 bg-sage-50/50 p-4 sm:p-5">
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
    </Section>
  );
}
