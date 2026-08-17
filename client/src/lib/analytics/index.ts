import { attachCollectors } from "./collectors";
import {
  getOrCreateSession,
  getOrCreateVisitorId,
  parseUa,
  touchSession,
} from "./ids";
import { AnalyticsQueue } from "./queue";
import { captureSourceFromUrl } from "./source";

declare global {
  interface Window {
    __slAnalyticsStarted?: boolean;
  }
}

function envFlag(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  return value === "1" || value.toLowerCase() === "true";
}

export function initAnalytics(): () => void {
  if (typeof window === "undefined") return () => undefined;
  if (window.__slAnalyticsStarted) return () => undefined;

  const enabled = envFlag(import.meta.env.VITE_ANALYTICS_ENABLED, true);
  if (!enabled) return () => undefined;

  if (navigator.webdriver) return () => undefined;

  window.__slAnalyticsStarted = true;

  const visitorId = getOrCreateVisitorId();
  const sessionMeta = getOrCreateSession();
  const ua = parseUa();
  const sourceSlug = captureSourceFromUrl();

  const queue = new AnalyticsQueue({
    id: sessionMeta.id,
    visitorId,
    startedAt: sessionMeta.startedAt,
    referrer: document.referrer || null,
    landingPath: window.location.pathname + window.location.hash || "/",
    uaDevice: ua.device,
    uaBrowser: ua.browser,
    screenW: window.screen?.width || window.innerWidth,
    hasReplay: false,
    sourceSlug,
  });

  const detachCollectors = attachCollectors(queue);

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
    window.removeEventListener("pointerdown", onActivity);
    window.removeEventListener("keydown", onActivity);
    window.removeEventListener("pagehide", onHide);
    void queue.flush(true);
    window.__slAnalyticsStarted = false;
  };
}
