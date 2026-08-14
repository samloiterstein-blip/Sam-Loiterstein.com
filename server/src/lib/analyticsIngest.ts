import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  CollectClick,
  CollectEvent,
  CollectPayload,
  CollectSession,
  ReplayPayload,
} from "./analyticsTypes.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EVENT_TYPES = new Set([
  "pageview",
  "section_view",
  "scroll_depth",
  "click",
]);

const MAX_EVENTS = 100;
const MAX_CLICKS = 100;
const MAX_REPLAY_EVENTS = 200;
const MAX_STRING = 500;
const MAX_TARGET = 200;

let client: SupabaseClient | null = null;
let lastKey = "";

export function getAnalyticsSupabase(): SupabaseClient | null {
  const url =
    process.env.ANALYTICS_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const key =
    process.env.ANALYTICS_SUPABASE_SECRET_KEY?.trim() ||
    process.env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.ANALYTICS_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    null;

  if (!url || !key) return null;

  if (!client || lastKey !== key) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    lastKey = key;
  }
  return client;
}

export function getAnalyticsReadToken(): string | null {
  return (
    process.env.ANALYTICS_READ_TOKEN?.trim() ||
    process.env.ANALYTICS_SESSION_SECRET?.trim() ||
    null
  );
}

export function isAllowedAnalyticsOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  const allowed = (
    process.env.ALLOWED_ORIGINS ||
    "http://127.0.0.1:5173,http://localhost:5173,https://sam-loiterstein.com"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowed.includes(origin)) return true;

  try {
    const host = new URL(origin).hostname;
    return (
      host === "sam-loiterstein.com" ||
      host.endsWith(".sam-loiterstein.com") ||
      host.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

function asTrimmed(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim().slice(0, max);
  return t || null;
}

function parseSession(raw: unknown): CollectSession | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const id = asTrimmed(s.id, 36);
  const visitorId = asTrimmed(s.visitorId, 36);
  if (!id || !visitorId || !UUID_RE.test(id) || !UUID_RE.test(visitorId)) {
    return null;
  }

  const startedAt = asTrimmed(s.startedAt, 40) || new Date().toISOString();
  const landingPath = asTrimmed(s.landingPath, MAX_STRING) || "/";

  return {
    id,
    visitorId,
    startedAt,
    referrer: asTrimmed(s.referrer, MAX_STRING),
    landingPath,
    uaDevice: asTrimmed(s.uaDevice, 80),
    uaBrowser: asTrimmed(s.uaBrowser, 80),
    screenW:
      typeof s.screenW === "number" && Number.isFinite(s.screenW)
        ? Math.round(s.screenW)
        : null,
    hasReplay: Boolean(s.hasReplay),
  };
}

function parseEvents(raw: unknown): CollectEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: CollectEvent[] = [];
  for (const item of raw.slice(0, MAX_EVENTS)) {
    if (!item || typeof item !== "object") continue;
    const e = item as Record<string, unknown>;
    const type = asTrimmed(e.type, 40);
    if (!type || !EVENT_TYPES.has(type)) continue;
    const props =
      e.props && typeof e.props === "object" && !Array.isArray(e.props)
        ? (e.props as Record<string, unknown>)
        : {};
    out.push({
      type: type as CollectEvent["type"],
      ts: asTrimmed(e.ts, 40) || undefined,
      path: asTrimmed(e.path, MAX_STRING) || "/",
      props,
    });
  }
  return out;
}

function parseClicks(raw: unknown): CollectClick[] {
  if (!Array.isArray(raw)) return [];
  const out: CollectClick[] = [];
  for (const item of raw.slice(0, MAX_CLICKS)) {
    if (!item || typeof item !== "object") continue;
    const c = item as Record<string, unknown>;
    if (typeof c.xPct !== "number" || typeof c.yPct !== "number") continue;
    out.push({
      ts: asTrimmed(c.ts, 40) || undefined,
      path: asTrimmed(c.path, MAX_STRING) || "/",
      target: asTrimmed(c.target, MAX_TARGET),
      xPct: clampPct(c.xPct),
      yPct: clampPct(c.yPct),
      vw:
        typeof c.vw === "number" && Number.isFinite(c.vw)
          ? Math.round(c.vw)
          : null,
      vh:
        typeof c.vh === "number" && Number.isFinite(c.vh)
          ? Math.round(c.vh)
          : null,
    });
  }
  return out;
}

export function parseCollectPayload(body: unknown): CollectPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const session = parseSession(b.session);
  if (!session) return null;
  return {
    session,
    events: parseEvents(b.events),
    clicks: parseClicks(b.clicks),
    endedAt: asTrimmed(b.endedAt, 40),
  };
}

export function parseReplayPayload(body: unknown): ReplayPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const sessionId = asTrimmed(b.sessionId, 36);
  if (!sessionId || !UUID_RE.test(sessionId)) return null;
  if (typeof b.seq !== "number" || !Number.isInteger(b.seq) || b.seq < 0) {
    return null;
  }
  if (!Array.isArray(b.events) || b.events.length === 0) return null;
  if (b.events.length > MAX_REPLAY_EVENTS) return null;
  return {
    sessionId,
    seq: b.seq,
    events: b.events,
  };
}

export async function ingestCollect(
  payload: CollectPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getAnalyticsSupabase();
  if (!sb) {
    return { ok: false, error: "Analytics store not configured" };
  }

  const { session, events = [], clicks = [], endedAt } = payload;
  const now = new Date().toISOString();

  const { error: visitorError } = await sb.rpc("analytics_upsert_visitor", {
    p_id: session.visitorId,
    p_first_seen: session.startedAt,
    p_last_seen: now,
  });
  if (visitorError) return { ok: false, error: visitorError.message };

  const { error: sessionError } = await sb.rpc("analytics_upsert_session", {
    p_id: session.id,
    p_visitor_id: session.visitorId,
    p_started_at: session.startedAt,
    p_ended_at: endedAt || null,
    p_referrer: session.referrer,
    p_landing_path: session.landingPath,
    p_ua_device: session.uaDevice,
    p_ua_browser: session.uaBrowser,
    p_screen_w: session.screenW,
    p_has_replay: session.hasReplay,
  });
  if (sessionError) return { ok: false, error: sessionError.message };

  if (events.length) {
    const rows = events.map((e) => ({
      session_id: session.id,
      ts: e.ts || now,
      type: e.type,
      path: e.path || "/",
      props: e.props || {},
    }));
    const { error } = await sb.rpc("analytics_insert_events", { p_rows: rows });
    if (error) return { ok: false, error: error.message };
  }

  if (clicks.length) {
    const rows = clicks.map((c) => ({
      session_id: session.id,
      ts: c.ts || now,
      path: c.path || "/",
      target: c.target,
      x_pct: c.xPct,
      y_pct: c.yPct,
      vw: c.vw,
      vh: c.vh,
    }));
    const { error } = await sb.rpc("analytics_insert_clicks", { p_rows: rows });
    if (error) return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function ingestReplay(
  payload: ReplayPayload
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const sb = getAnalyticsSupabase();
  if (!sb) {
    return { ok: false, error: "Analytics store not configured" };
  }

  const { data: exists, error: existsErr } = await sb.rpc(
    "analytics_session_exists",
    { p_id: payload.sessionId }
  );
  if (existsErr) return { ok: false, error: existsErr.message };
  if (!exists) {
    return { ok: false, error: "Unknown session", status: 404 };
  }

  const { error } = await sb.rpc("analytics_insert_replay_chunk", {
    p_session_id: payload.sessionId,
    p_seq: payload.seq,
    p_payload: payload.events,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
