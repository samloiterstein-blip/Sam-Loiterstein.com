import type { AnalyticsQueue } from "./queue";

type StopFn = () => void;

export async function startReplay(
  queue: AnalyticsQueue,
  sampleEnabled: boolean
): Promise<StopFn | null> {
  if (!sampleEnabled) return null;

  try {
    const { record } = await import("rrweb");
    let seq = 0;
    let buffer: unknown[] = [];
    let flushTimer: number | null = null;

    const flush = async (force = false) => {
      if (!buffer.length) return;
      if (!force && buffer.length < 20) return;
      const events = buffer;
      buffer = [];
      const body = JSON.stringify({
        sessionId: queue.getSession().id,
        seq: seq++,
        events,
      });
      try {
        await fetch("/api/analytics/replay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: force,
        });
      } catch {
        // ignore
      }
    };

    const stop = record({
      emit(event) {
        buffer.push(event);
        if (flushTimer == null) {
          flushTimer = window.setTimeout(() => {
            flushTimer = null;
            void flush();
          }, 5000);
        }
      },
      maskAllInputs: true,
      maskInputOptions: {
        password: true,
        email: true,
        text: true,
        textarea: true,
      },
      blockClass: "rr-block",
      slimDOMOptions: {
        script: true,
        comment: true,
        headFavicon: true,
        headWhitespace: true,
        headMetaDescKeywords: true,
        headMetaSocial: true,
        headMetaRobots: true,
        headMetaHttpEquiv: true,
        headMetaAuthorship: true,
        headMetaVerification: true,
      },
    });

    // Ensure session row exists with has_replay before chunks arrive
    queue.updateSession({ hasReplay: true });
    void queue.flush();

    return () => {
      stop?.();
      if (flushTimer != null) window.clearTimeout(flushTimer);
      void flush(true);
    };
  } catch {
    return null;
  }
}
