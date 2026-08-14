import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/Button";
import { hero, site } from "@/data/content";

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HOLD_MS = 2500;
const TRANSITION_MS = 500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function RotatingTitle({ titles }: { titles: readonly string[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    let timer: number | undefined;

    const schedule = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setIndex((current) => (current + 1) % titles.length);
        schedule();
      }, HOLD_MS + TRANSITION_MS);
    };

    schedule();

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [reducedMotion, titles.length]);

  if (reducedMotion) {
    return <span className="block text-ink-700">{titles[0]}</span>;
  }

  return (
    <span aria-hidden="true" className="relative mt-1 block min-w-0 sm:mt-0">
      <span className="grid overflow-hidden">
        {titles.map((title) => (
          <span key={title} className="invisible col-start-1 row-start-1 block text-ink-700">
            {title}
          </span>
        ))}
        <span key={titles[index]} className="hero-rotating-title col-start-1 row-start-1 block text-ink-700">
          {titles[index]}
        </span>
      </span>
    </span>
  );
}

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const accessibleRoles = hero.rotatingTitles
    .map((title) => title.replace(/\.$/, ""))
    .join(", ")
    .replace(/, ([^,]+)$/, ", and $1");

  return (
    <section id="top" className="relative overflow-hidden pb-6 pt-28 sm:pb-8 sm:pt-36 lg:pb-10 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(116,153,125,0.18),rgba(116,153,125,0)_70%)]" />
        <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-sage-200/40 blur-3xl" />
        <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-cream blur-3xl" />
      </div>

      <div className="container-page">
        <motion.span custom={0} initial="hidden" animate="visible" variants={fade} className="eyebrow">
          {hero.eyebrow}
        </motion.span>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fade}
          className="mt-6 font-display text-[44px] font-medium leading-[1.02] tracking-tightish text-ink-900 sm:text-6xl lg:text-7xl"
        >
          <span className="text-sage-800">{site.name}</span>
          <span className="sr-only"> {accessibleRoles}.</span>
          <RotatingTitle titles={hero.rotatingTitles} />
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fade}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl"
        >
          {hero.description}
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fade}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button
            as="a"
            href="#work"
            size="lg"
            data-analytics="cta:hero-explore-systems"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("work");
            }}
          >
            {hero.primaryCta}
            <ArrowUpRight size={16} />
          </Button>

          <Button
            as="a"
            href="#contact"
            variant="secondary"
            size="lg"
            data-analytics="cta:hero-start-conversation"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("contact");
            }}
          >
            {hero.secondaryCta}
            <ArrowRight size={16} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
