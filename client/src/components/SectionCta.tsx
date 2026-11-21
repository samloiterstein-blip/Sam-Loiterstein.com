import type { MouseEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { sectionCtas, substack } from "@/data/content";

type Place = keyof typeof sectionCtas;

function scrollTo(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

const buttonBase =
  "mt-4 inline-flex h-12 items-center gap-2 px-6 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2";

export function SectionCta({ place, href }: { place: Place; href?: string }) {
  if (place === "approach") {
    const copy = sectionCtas.approach;
    return (
      <div className="mt-10 max-w-xl">
        <p className="text-base font-medium leading-relaxed text-ink-900">{copy.lead}</p>
        <p className="mt-2 text-base leading-relaxed text-ink-700">{copy.body}</p>
        <a
          href="#contact"
          onClick={scrollTo("contact")}
          data-analytics="cta:approach-contact"
          className={`${buttonBase} rounded-full bg-sage-700 text-cream shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_8px_20px_-8px_rgba(35,54,42,0.55)] hover:bg-sage-800`}
        >
          {copy.action}
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>
    );
  }

  if (place === "work") {
    const copy = sectionCtas.work;
    return (
      <div className="mt-10 max-w-2xl rounded-3xl bg-sage-800 px-7 py-7 text-cream sm:px-8 sm:py-8">
        <p className="max-w-lg text-xl leading-snug">{copy.lead}</p>
        <a
          href="#contact"
          onClick={scrollTo("contact")}
          data-analytics="cta:work-contact"
          className={`${buttonBase} rounded-full bg-cream text-sage-900 hover:bg-white`}
        >
          {copy.action}
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>
    );
  }

  if (place === "writing") {
    const copy = sectionCtas.writing;
    const latest = href || substack.publicationUrl;
    return (
      <a
        href={latest}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="cta:writing-latest"
        className={`${buttonBase} rounded-md bg-ink-900 text-cream hover:bg-ink-800`}
      >
        {copy.action}
        <ArrowUpRight size={16} aria-hidden />
      </a>
    );
  }

  const copy = sectionCtas.background;
  return (
    <a
      href="#experience"
      onClick={scrollTo("experience")}
      data-analytics="cta:background-experience"
      className={`${buttonBase} rounded-none bg-ink-900 text-cream hover:bg-ink-800`}
    >
      {copy.action}
      <ArrowRight size={16} aria-hidden />
    </a>
  );
}
