import { useEffect, useRef, useState } from "react";
import { workedWithLogos, workedWithSection, type LogoFit, type WorkedWithLogo } from "@/data/content";
import { cn } from "@/lib/cn";

const FIT_CLASS: Record<LogoFit, string> = {
  mark: "max-h-16 max-w-16 sm:max-h-20 sm:max-w-20",
  wordmark: "max-h-12 max-w-[13rem] sm:max-h-14 sm:max-w-[16rem]",
  lockup: "max-h-16 max-w-[14rem] sm:max-h-20 sm:max-w-[17rem]",
};

const LOOP_MS = 70000;
const DRAG_THRESHOLD_PX = 8;

function wrapOffset(offset: number, half: number) {
  if (half <= 0) return 0;
  return ((offset % half) + half) % half;
}

function LogoMark({ logo, duplicate = false }: { logo: WorkedWithLogo; duplicate?: boolean }) {
  const image = (
    <img
      src={logo.logoSrc}
      alt=""
      draggable={false}
      className={cn("logo-mark h-auto w-auto", FIT_CLASS[logo.fit], logo.invert && "logo-mark-invert")}
      loading="lazy"
      decoding="async"
    />
  );

  const className = "logo-mark-slot flex h-24 shrink-0 items-center justify-center px-6 sm:h-28 sm:px-8";

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${logo.name} (opens in a new tab)`}
        tabIndex={duplicate ? -1 : undefined}
        className={cn(className, "logo-mark-link")}
      >
        {image}
      </a>
    );
  }

  return (
    <span aria-label={logo.name} className={className}>
      {image}
    </span>
  );
}

type Drag = {
  pointerId: number;
  lastX: number;
  lastT: number;
  originX: number;
  moved: boolean;
};

export function LogoMarquee() {
  const shellRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const velocityRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef<Drag | null>(null);
  const suppressClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    const onMotion = () => {
      reduced = motionQuery.matches;
    };
    motionQuery.addEventListener("change", onMotion);

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const track = trackRef.current;

      if (track && !reduced) {
        const half = track.scrollWidth / 2;
        halfRef.current = half;
        const auto = half > 0 ? half / LOOP_MS : 0;

        if (!dragRef.current && half > 0) {
          if (Math.abs(velocityRef.current) > auto) {
            offsetRef.current += velocityRef.current * dt;
            velocityRef.current *= Math.exp(-dt / 180);
            if (Math.abs(velocityRef.current) <= auto) velocityRef.current = 0;
          } else if (!pausedRef.current) {
            offsetRef.current += auto * dt;
          }
          offsetRef.current = wrapOffset(offsetRef.current, half);
        }

        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      motionQuery.removeEventListener("change", onMotion);
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    velocityRef.current = 0;
    dragRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastT: performance.now(),
      originX: event.clientX,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.lastX;
    if (!drag.moved && Math.abs(event.clientX - drag.originX) < DRAG_THRESHOLD_PX) return;

    if (!drag.moved) {
      drag.moved = true;
      setDragging(true);
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Capture can fail if the pointer is already gone.
      }
    }
    event.preventDefault();

    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    drag.lastX = event.clientX;
    drag.lastT = now;

    const half = halfRef.current || (trackRef.current ? trackRef.current.scrollWidth / 2 : 0);
    halfRef.current = half;
    offsetRef.current = wrapOffset(offsetRef.current - dx, half);
    velocityRef.current = -dx / dt;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 400);
    }
    setDragging(false);
  };

  const onClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  return (
    <section
      aria-labelledby="worked-with-heading"
      className={cn("logo-marquee-shell pb-2 pt-2 sm:pt-4", dragging && "is-dragging")}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") pausedRef.current = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") pausedRef.current = false;
      }}
    >
      <p
        id="worked-with-heading"
        className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-sage-800 sm:gap-4 sm:text-sm"
      >
        <span className="h-px w-8 bg-sage-400 sm:w-10" aria-hidden />
        {workedWithSection.label}
        <span className="h-px w-8 bg-sage-400 sm:w-10" aria-hidden />
      </p>

      <div ref={shellRef} className="relative mt-3 overflow-hidden select-none">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-28"
        />

        <div ref={trackRef} className="logo-marquee-track flex w-max items-center">
          {workedWithLogos.map((logo) => (
            <LogoMark key={logo.logoSrc} logo={logo} />
          ))}
          <div aria-hidden className="flex items-center">
            {workedWithLogos.map((logo) => (
              <LogoMark key={`${logo.logoSrc}-copy`} logo={logo} duplicate />
            ))}
          </div>
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
