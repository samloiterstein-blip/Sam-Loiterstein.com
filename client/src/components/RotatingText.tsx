import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const DEFAULT_HOLD_MS = 2500;
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

export function RotatingText({
  texts,
  inline = false,
  className,
  holdMs = DEFAULT_HOLD_MS,
}: {
  texts: readonly string[];
  inline?: boolean;
  className?: string;
  holdMs?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    let timer: number | undefined;

    const schedule = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setIndex((current) => (current + 1) % texts.length);
        schedule();
      }, holdMs + TRANSITION_MS);
    };

    schedule();

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [holdMs, reducedMotion, texts.length]);

  const frame = inline ? "inline-grid align-baseline" : "grid";

  if (reducedMotion) {
    return <span className={cn(inline ? "inline" : "block", className)}>{texts[0]}</span>;
  }

  return (
    <span className={cn(frame, "overflow-hidden", className)}>
      {texts.map((text) => (
        <span key={text} className="invisible col-start-1 row-start-1">
          {text}
        </span>
      ))}
      <span key={texts[index]} className="hero-rotating-title col-start-1 row-start-1">
        {texts[index]}
      </span>
    </span>
  );
}
