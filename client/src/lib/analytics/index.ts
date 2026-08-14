import { attachCollectors } from "./collectors";
import {
  getOrCreateSession,
  getOrCreateVisitorId,
  parseUa,
  touchSession,
} from "./ids";
import { AnalyticsQueue } from "./queue";
import { startReplay } from "./replay";

declare global {
  interface Window {
    __slAnalyticsStarted?: boolean;
  }
}

function envFlag(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  return value === "1" || value.toLowerCase() === "true";
}

function sampleRate(): number {
  const raw = import.meta.env.VITE_ANALYTICS_REPLAY_SAMPLE;
  const n = raw != null && raw !== "" ? Number(raw) : 0.2;
  if (!Number.isFinite(n)) return 0.2;
  return Math.min(1, Math.max(0, n));
}

export function initAnalytics(): () => void {
  if (typeof window === "undefined") return () => undefined;
  if (window.__slAnalyticsStarted) return () => undefined;

  const enabled = envFlag(import.meta.env.VITE_ANALYTICS_ENABLED, true);
  if (!enabled) return () => undefined;

  // Skip during Vite prerender / bots without interaction
  if (navigator.webdriver) return () => undefined;

  window.__slAnalyticsStarted = true;

  const visitorId = getOrCreateVisitorId();
  const sessionMeta = getOrCreateSession(sampleRate());
  const ua = parseUa();

  const queue = new AnalyticsQueue({
    id: sessionMeta.id,
    visitorId,
    startedAt: sessionMeta.startedAt,
    referrer: document.referrer || null,
    landingPath: window.location.pathname + window.location.hash || "/",
    uaDevice: ua.device,
    uaBrowser: ua.browser,
    screenW: window.screen?.width || window.innerWidth,
    hasReplay: sessionMeta.hasReplay,
  });

  const detachCollectors = attachCollectors(queue);
  let stopReplay: (() => void) | null = null;

  void startReplay(queue, sessionMeta.hasReplay).then((stop) => {
    stopReplay = stop;
  });

  const onActivity = () => touchSession(sessionMeta);
  window.addEventListener("pointerdown", onActivity, { passive: true });
  window.addEventListener("keydown", onActivity, { passive: true });

  const onHide = () => {
    void queue.flush(true);
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") onHide();
  });
  window.addEventListener("pagehide", onHide);

  return () => {
    detachCollectors();
    stopReplay?.();
    window.removeEventListener("pointerdown", onActivity);
    window.removeEventListener("keydown", onActivity);
    window.removeEventListener("pagehide", onHide);
    void queue.flush(true);
    window.__slAnalyticsStarted = false;
  };
}
