import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { WorkMenuItem } from "@/data/content";

const FIRST_TURN_MS = 6000;
const HOLD_AFTER_MS = 6000;
const TURN_MS = 2200;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function cubeTransform(angle: number) {
  const rad = (Math.abs(angle) * Math.PI) / 180;
  const span = Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad));
  const fit = 1 / span ** 1.2;
  return `scale(${fit}) translateZ(calc(var(--half) * -1)) rotateY(${angle}deg)`;
}

function nextFree(current: number, blocked: number[], items: readonly WorkMenuItem[]) {
  const taken = new Set(blocked.map((index) => items[index]?.slug));
  let next = current;
  for (let step = 0; step < items.length; step += 1) {
    next = (next + 1) % items.length;
    if (!taken.has(items[next].slug)) return next;
  }
  return (current + 1) % items.length;
}

function WorkFace({ item, hidden = false }: { item: WorkMenuItem; hidden?: boolean }) {
  return (
    <div className="px-4 py-3 sm:px-5" aria-hidden={hidden ? true : undefined}>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-sage-700">{item.category}</p>
      <h3 className="mt-1 font-display text-xl leading-snug text-ink-900">{item.title}</h3>
      <p className="mt-2 text-sm leading-snug text-ink-700">{item.description}</p>
      {hidden ? (
        <p className="mt-2 text-sm font-medium text-sage-800">{item.linkLabel}</p>
      ) : (
        <a
          href={item.href}
          {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-sage-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
        >
          {item.linkLabel}
          <ArrowRight size={14} aria-hidden />
        </a>
      )}
    </div>
  );
}

export function CubeTurn({
  front,
  side,
  from,
  turning,
  onTurnEnd,
  className = "relative min-h-[11rem] flex-1",
  faceClassName = "",
  sizer,
}: {
  front: ReactNode;
  side: ReactNode;
  from: "left" | "right";
  turning: boolean;
  onTurnEnd: () => void;
  className?: string;
  faceClassName?: string;
  sizer?: ReactNode;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const onTurnEndRef = useRef(onTurnEnd);
  onTurnEndRef.current = onTurnEnd;
  const sideClass = from === "left" ? "work-face-left" : "work-face-right";

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const cube = cubeRef.current;
    if (!scene || !cube) return;
    const fit = () => {
      const face = Math.max(scene.clientWidth, 1);
      cube.style.setProperty("--half", `${face / 2}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!turning && cubeRef.current) cubeRef.current.style.transform = "";
  }, [turning, front]);

  useEffect(() => {
    if (!turning) return;
    const cube = cubeRef.current;
    if (!cube) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onTurnEndRef.current();
      return;
    }

    let frame = 0;
    let active = true;
    const started = performance.now();
    const direction = from === "left" ? 1 : -1;
    const tick = (now: number) => {
      if (!active) return;
      const t = Math.min((now - started) / TURN_MS, 1);
      cube.style.transform = cubeTransform(easeInOut(t) * 90 * direction);
      if (t < 1) frame = window.requestAnimationFrame(tick);
      else onTurnEndRef.current();
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [from, turning]);

  return (
    <div ref={sceneRef} className={className} style={{ perspective: "1000px" }}>
      {sizer ? (
        <div className="invisible grid" aria-hidden>
          {sizer}
        </div>
      ) : null}
      <div ref={cubeRef} className="work-cube">
        <div className={`work-face work-face-front ${faceClassName}`}>{front}</div>
        <div className={`work-face ${sideClass} ${faceClassName}`} aria-hidden>
          {side}
        </div>
      </div>
    </div>
  );
}

function WorkCube({
  item,
  nextItem,
  from,
  turning,
  onTurnEnd,
}: {
  item: WorkMenuItem;
  nextItem: WorkMenuItem;
  from: "left" | "right";
  turning: boolean;
  onTurnEnd: () => void;
}) {
  return (
    <CubeTurn
      from={from}
      turning={turning}
      onTurnEnd={onTurnEnd}
      front={<WorkFace item={item} />}
      side={<WorkFace item={nextItem} hidden />}
    />
  );
}

export function RotatingWorkPair({ items }: { items: readonly WorkMenuItem[] }) {
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(items.length > 1 ? 1 : 0);
  const [turning, setTurning] = useState<"top" | "bottom" | null>(null);
  const [incoming, setIncoming] = useState<number | null>(null);
  const endRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (items.length < 2) return;
    let alive = true;
    const timers = new Set<number>();
    const indices = { top: 0, bottom: 1 };
    let side: "top" | "bottom" = "bottom";

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const waitForTurn = () =>
      new Promise<void>((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(backup);
          timers.delete(backup);
          endRef.current = null;
          resolve();
        };
        endRef.current = finish;
        const backup = window.setTimeout(finish, TURN_MS + 500);
        timers.add(backup);
      });

    const run = async () => {
      await wait(FIRST_TURN_MS);
      while (alive) {
        const current = indices[side];
        const otherSide = side === "top" ? "bottom" : "top";
        const other = indices[otherSide];
        const otherNext = nextFree(other, [other, current], items);
        const dest = nextFree(current, [current, other, otherNext], items);
        if (!alive) return;
        setIncoming(dest);
        setTurning(side);
        await waitForTurn();
        if (!alive) return;
        indices[side] = dest;
        if (side === "top") setTop(dest);
        else setBottom(dest);
        setTurning(null);
        setIncoming(null);
        side = otherSide;
        await wait(HOLD_AFTER_MS);
      }
    };

    void run();
    return () => {
      alive = false;
      endRef.current = null;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [items]);

  const finishTurn = () => endRef.current?.();

  const topNext = turning === "top" && incoming !== null ? incoming : nextFree(top, [top, bottom], items);
  const bottomNext =
    turning === "bottom" && incoming !== null ? incoming : nextFree(bottom, [bottom, top, topNext], items);

  return (
    <>
      <WorkCube
        item={items[top]}
        nextItem={items[topNext]}
        from="left"
        turning={turning === "top"}
        onTurnEnd={finishTurn}
      />
      <WorkCube
        item={items[bottom]}
        nextItem={items[bottomNext]}
        from="right"
        turning={turning === "bottom"}
        onTurnEnd={finishTurn}
      />
    </>
  );
}
