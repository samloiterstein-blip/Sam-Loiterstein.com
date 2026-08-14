type QueuedEvent = {
  type: "pageview" | "section_view" | "scroll_depth" | "click";
  ts: string;
  path: string;
  props?: Record<string, unknown>;
};

type QueuedClick = {
  ts: string;
  path: string;
  target: string | null;
  xPct: number;
  yPct: number;
  vw: number;
  vh: number;
};

type SessionInfo = {
  id: string;
  visitorId: string;
  startedAt: string;
  referrer: string | null;
  landingPath: string;
  uaDevice: string;
  uaBrowser: string;
  screenW: number;
  hasReplay: boolean;
};

export class AnalyticsQueue {
  private events: QueuedEvent[] = [];
  private clicks: QueuedClick[] = [];
  private flushTimer: number | null = null;
  private flushing = false;

  constructor(
    private session: SessionInfo,
    private collectUrl = "/api/analytics/collect"
  ) {}

  updateSession(partial: Partial<SessionInfo>) {
    this.session = { ...this.session, ...partial };
  }

  getSession() {
    return this.session;
  }

  pushEvent(event: Omit<QueuedEvent, "ts" | "path"> & { path?: string; props?: Record<string, unknown> }) {
    this.events.push({
      type: event.type,
      ts: new Date().toISOString(),
      path: event.path || window.location.pathname + window.location.hash || "/",
      props: event.props,
    });
    this.scheduleFlush();
  }

  pushClick(click: Omit<QueuedClick, "ts" | "path" | "vw" | "vh"> & { path?: string }) {
    this.clicks.push({
      ts: new Date().toISOString(),
      path: click.path || window.location.pathname + window.location.hash || "/",
      target: click.target,
      xPct: click.xPct,
      yPct: click.yPct,
      vw: window.innerWidth,
      vh: window.innerHeight,
    });
    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.flushTimer != null) return;
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      void this.flush();
    }, 2000);
  }

  async flush(ended = false) {
    if (this.flushing) return;
    if (!this.events.length && !this.clicks.length && !ended) return;

    this.flushing = true;
    const events = this.events.splice(0, this.events.length);
    const clicks = this.clicks.splice(0, this.clicks.length);

    const body = JSON.stringify({
      session: this.session,
      events,
      clicks,
      endedAt: ended ? new Date().toISOString() : null,
    });

    try {
      if (ended && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(this.collectUrl, blob);
      } else {
        await fetch(this.collectUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: ended,
        });
      }
    } catch {
      // drop on failure — analytics should never break the site
    } finally {
      this.flushing = false;
    }
  }
}
