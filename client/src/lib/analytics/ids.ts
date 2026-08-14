const VISITOR_KEY = "sl_vid";
const SESSION_KEY = "sl_sid";
const SESSION_META_KEY = "sl_smeta";
const SESSION_MS = 30 * 60 * 1000;

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return uuid();
  }
}

type SessionMeta = {
  id: string;
  startedAt: string;
  hasReplay: boolean;
  lastActivity: number;
};

export function getOrCreateSession(sampleRate: number): SessionMeta {
  const now = Date.now();
  try {
    const raw = sessionStorage.getItem(SESSION_META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SessionMeta;
      if (
        parsed?.id &&
        parsed.startedAt &&
        now - (parsed.lastActivity || 0) < SESSION_MS
      ) {
        parsed.lastActivity = now;
        sessionStorage.setItem(SESSION_META_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  const meta: SessionMeta = {
    id: uuid(),
    startedAt: new Date().toISOString(),
    hasReplay: Math.random() < sampleRate,
    lastActivity: now,
  };

  try {
    sessionStorage.setItem(SESSION_KEY, meta.id);
    sessionStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
  } catch {
    // ignore
  }

  return meta;
}

export function touchSession(meta: SessionMeta): void {
  meta.lastActivity = Date.now();
  try {
    sessionStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
  } catch {
    // ignore
  }
}

export function parseUa(): { device: string; browser: string } {
  const ua = navigator.userAgent;
  let device = "desktop";
  if (/iPad|Tablet/i.test(ua)) device = "tablet";
  else if (/Mobi|Android|iPhone/i.test(ua)) device = "mobile";

  let browser = "other";
  if (/Edg\//i.test(ua)) browser = "edge";
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "safari";
  else if (/Firefox\//i.test(ua)) browser = "firefox";

  return { device, browser };
}
