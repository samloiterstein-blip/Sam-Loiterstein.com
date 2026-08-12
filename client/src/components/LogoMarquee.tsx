import { workedWithLogos, workedWithSection, type LogoFit, type WorkedWithLogo } from "@/data/content";
import { cn } from "@/lib/cn";

const FIT_CLASS: Record<LogoFit, string> = {
  mark: "max-h-12 max-w-12 sm:max-h-14 sm:max-w-14",
  wordmark: "max-h-8 max-w-[9rem] sm:max-h-9 sm:max-w-[10rem]",
  lockup: "max-h-12 max-w-[9rem] sm:max-h-14 sm:max-w-[10rem]",
};

function LogoMark({ logo }: { logo: WorkedWithLogo }) {
  return (
    <span
      aria-label={logo.name}
      className="flex h-[4.5rem] w-44 shrink-0 items-center justify-center sm:h-20 sm:w-48"
    >
      <img
        src={logo.logoSrc}
        alt=""
        className={cn("logo-mark h-auto w-auto", FIT_CLASS[logo.fit], logo.invert && "logo-mark-invert")}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

export function LogoMarquee() {
  const loop = [...workedWithLogos, ...workedWithLogos];

  return (
    <section aria-labelledby="worked-with-heading" className="py-10 sm:py-12">
      <p
        id="worked-with-heading"
        className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-sage-800 sm:gap-4 sm:text-sm"
      >
        <span className="h-px w-8 bg-sage-400 sm:w-10" aria-hidden />
        {workedWithSection.label}
        <span className="h-px w-8 bg-sage-400 sm:w-10" aria-hidden />
      </p>

      <div className="logo-marquee-shell relative mt-8 overflow-hidden sm:mt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-28"
        />

        <div className="logo-marquee-track flex w-max items-center">
          {loop.map((logo, index) => (
            <LogoMark key={`${logo.logoSrc}-${index}`} logo={logo} />
          ))}
        </div>

        <ul className="logo-marquee-static flex-wrap items-center justify-center">
          {workedWithLogos.map((logo) => (
            <li key={logo.logoSrc}>
              <LogoMark logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
