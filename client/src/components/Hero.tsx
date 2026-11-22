import { type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { hero } from "@/data/content";
import { contactHref, openContact } from "@/lib/contactIntent";
import { RotatingText } from "./RotatingText";

export function Hero() {
  const scrollToBackground = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("background")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-28 sm:pt-32 lg:pb-14 lg:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(116,153,125,0.16),rgba(116,153,125,0)_70%)]" />
      </div>

      <div className="container-page grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.7fr)] lg:gap-12">
        <div>
          <p className="eyebrow">{hero.eyebrow}</p>

          <p
            aria-hidden="true"
            className="mt-5 max-w-3xl font-display text-[2rem] font-medium leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl lg:text-[3.15rem]"
          >
            <RotatingText texts={hero.rotatingTitles} />
          </p>

          <h1 className="mt-5 max-w-2xl text-lg font-normal leading-relaxed text-ink-700">
            {hero.headline} <em className="font-display italic text-ink-900">{hero.headlineEmphasis}</em>
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={contactHref(hero.primaryIntent)}
              data-analytics="cta:hero-discuss"
              onClick={(event) => {
                event.preventDefault();
                openContact(hero.primaryIntent);
              }}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-sage-700 px-6 text-base font-medium text-cream transition hover:bg-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
            >
              {hero.primaryCta}
              <ArrowRight size={16} aria-hidden />
            </a>
            <a
              href="#background"
              data-analytics="cta:hero-work"
              onClick={scrollToBackground}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-900 bg-white px-6 text-base font-medium text-ink-900 transition hover:bg-ink-900 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
            >
              {hero.secondaryCta}
              <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </div>

        <img
          src={hero.portraitSrc}
          alt={hero.portraitAlt}
          width={331}
          height={414}
          className="mx-auto h-auto w-full max-w-[16rem] object-contain sm:max-w-xs lg:max-h-[26rem] lg:max-w-[22rem] lg:justify-self-end"
          decoding="async"
        />
      </div>
    </section>
  );
}
