import { practiceBridge } from "@/data/content";

export function PracticeBridge() {
  return (
    <section id="practice-bridge" aria-labelledby="practice-bridge-title" className="pt-14 sm:pt-16 lg:pt-20">
      <div className="container-page pb-8 sm:pb-10">
        <div className="h-px bg-sage-300/80" />
        <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-sage-800 sm:mt-10 sm:text-xs">
          {practiceBridge.eyebrow}
        </p>
        <h2
          id="practice-bridge-title"
          className="mt-3 text-center font-display text-4xl font-medium tracking-tightish text-ink-900 sm:text-5xl lg:text-6xl"
        >
          {practiceBridge.title}
        </h2>
      </div>
    </section>
  );
}
