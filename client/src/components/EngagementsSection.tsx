import { useLayoutEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "./ui/Section";
import { RotatingText } from "./RotatingText";
import { RotatingWorkPair } from "./RotatingWork";
import { buildSection, workMenuRotation } from "@/data/content";
import { contactHref, openContact } from "@/lib/contactIntent";
import { cn } from "@/lib/cn";

function shuffled<T>(items: readonly T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = next[i];
    next[i] = next[j];
    next[j] = current;
  }
  return next;
}

export function EngagementsSection() {
  const slides = buildSection.slides;
  const [slideIndex, setSlideIndex] = useState(0);
  const [places, setPlaces] = useState(buildSection.places);

  useLayoutEffect(() => {
    setPlaces(shuffled(buildSection.places));
  }, []);
  const showSlide = (next: number) => {
    const count = slides.length;
    setSlideIndex((next + count) % count);
  };

  return (
    <Section id="offer" className="!pt-0 !pb-6 sm:!pt-2">
      <h2 className="sr-only">{buildSection.title}</h2>

      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        <article
          className="flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white lg:col-span-2"
          aria-roledescription="carousel"
          aria-label="Featured builds"
        >
          <div className="relative aspect-[1024/581] max-h-[38vh] w-full bg-[#f7f6f2]">
            {slides.map((item, index) => (
              <img
                key={item.image}
                src={item.image}
                alt={index === slideIndex ? item.imageAlt : ""}
                width={item.width}
                height={item.height}
                className={cn(
                  "absolute inset-0 h-full w-full object-contain motion-reduce:transition-none transition-opacity duration-300",
                  index === slideIndex ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
            <button
              type="button"
              aria-label="Previous build"
              onClick={() => showSlide(slideIndex - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-100 bg-white/90 text-ink-900 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next build"
              onClick={() => showSlide(slideIndex + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-100 bg-white/90 text-ink-900 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
          <div className="grid flex-1">
            {slides.map((item, index) => {
              const selected = index === slideIndex;
              return (
                <div
                  key={item.headline}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col p-5 motion-reduce:transition-none transition-opacity duration-300 sm:p-6",
                    selected ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                  aria-hidden={selected ? undefined : true}
                >
                  <h3 className="font-display text-2xl leading-snug text-ink-900">{item.headline}</h3>
                  {item.body ? <p className="mt-3 text-sm leading-relaxed text-ink-700">{item.body}</p> : null}
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">
                    <span className="sr-only">See how this could work at your organization.</span>
                    <span aria-hidden="true">
                      {buildSection.lineLead}{" "}
                      {selected ? (
                        <RotatingText
                          texts={places.map((place) => `${place}.`)}
                          inline
                          holdMs={2000}
                          className="font-display text-base italic text-ink-900"
                        />
                      ) : (
                        <span className="font-display text-base italic text-ink-900">{places[0]}.</span>
                      )}
                    </span>
                  </p>
                  <a
                    href={item.linkHref}
                    {...(item.linkHref.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    tabIndex={selected ? undefined : -1}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sage-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
                  >
                    {item.linkLabel}
                    <ArrowRight size={14} aria-hidden />
                  </a>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2 pb-5" role="tablist" aria-label="Choose a build">
            {slides.map((item, index) => {
              const selected = index === slideIndex;
              return (
                <button
                  key={item.image}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={item.headline}
                  onClick={() => showSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400",
                    selected ? "w-6 bg-sage-700" : "w-2 bg-sage-300 hover:bg-sage-500",
                  )}
                />
              );
            })}
          </div>
        </article>

        <aside className="flex flex-col divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          <RotatingWorkPair items={workMenuRotation} />
        </aside>
      </div>

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <a
          href="#background"
          data-analytics="cta:offer-background"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 px-6 text-base font-medium text-cream transition hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
        >
          {buildSection.portfolioCta}
        </a>
        <p className="max-w-xl text-sm leading-relaxed text-ink-700">
          {buildSection.ctaLead}{" "}
          <a
            href={contactHref(buildSection.ctaIntent)}
            data-analytics="cta:offer-project"
            onClick={(event) => {
              event.preventDefault();
              openContact(buildSection.ctaIntent);
            }}
            className="font-medium text-sage-800 underline underline-offset-4 hover:text-sage-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
          >
            {buildSection.cta}
          </a>
        </p>
      </div>
    </Section>
  );
}
