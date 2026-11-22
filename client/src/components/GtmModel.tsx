import { ArrowRight } from "lucide-react";

const steps = ["Research", "Prospect", "Outreach", "Close", "Learn, rinse, repeat"] as const;

export function GtmModel() {
  return (
    <figure className="px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
      <figcaption className="sr-only">
        A recursive go-to-market model. Research, prospect, outreach, close, then learn, rinse, and repeat.
      </figcaption>
      <ol className="relative grid grid-cols-1 gap-3 border-l border-sage-400 pl-4 sm:grid-cols-[repeat(4,minmax(0,1fr))_minmax(7.5rem,1.35fr)] sm:gap-x-5 sm:border-0 sm:pl-0">
        <span
          className="absolute -left-[5px] top-0 h-2 w-2 rotate-45 border-l border-t border-sage-600 sm:hidden"
          aria-hidden="true"
        />
        {steps.map((label, index) => {
          const last = index === steps.length - 1;
          return (
            <li key={label} className="relative min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-sage-700">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-display text-lg leading-tight text-ink-900 sm:text-xl">
                {last ? (
                  <>
                    Learn, <span className="sm:block">rinse, repeat</span>
                  </>
                ) : (
                  label
                )}
              </p>
              {last ? null : (
                <ArrowRight
                  size={13}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="absolute -right-4 top-6 hidden text-sage-400 sm:block"
                />
              )}
            </li>
          );
        })}
      </ol>
      <svg viewBox="0 0 1000 48" className="mt-2 hidden h-11 w-full text-sage-700 sm:block" aria-hidden="true">
        <path
          d="M948 2 V16 C948 30 948 30 934 30 H98 C80 30 80 30 80 14 V2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M80 2 L71 12 M80 2 L89 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </figure>
  );
}
