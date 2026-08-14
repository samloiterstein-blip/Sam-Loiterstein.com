import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE_NAME = "sl_analytics_session";
const SESSION_DAYS = 14;

let client: SupabaseClient | null = null;
let lastKey = "";

export function getAnalyticsSupabase(): SupabaseClient | null {
  const url = process.env.ANALYTICS_SUPABASE_URL?.trim();
  const key =
    process.env.ANALYTICS_SUPABASE_SECRET_KEY?.trim() ||
    process.env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.ANALYTICS_SUPABASE_PUBLISHABLE_KEY?.trim() ||
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

function getSecrets() {
  const password = process.env.ANALYTICS_DASHBOARD_PASSWORD?.trim();
  const secret =
    process.env.ANALYTICS_SESSION_SECRET?.trim() ||
    process.env.ANALYTICS_DASHBOARD_PASSWORD?.trim();
  return { password, secret };
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionCookie(): string | null {
  const { password, secret } = getSecrets();
  if (!password || !secret) return null;
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const sig = sign(payload, secret);
  const token = `${payload}.${sig}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

export function clearSessionCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((part) => {
      const [k, ...rest] = part.trim().split("=");
      return [k, rest.join("=")];
    })
  );
}

export function isAuthenticated(req: VercelRequest): boolean {
  const { secret } = getSecrets();
  if (!secret) return false;
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export function verifyPassword(candidate: string): boolean {
  const { password } = getSecrets();
  if (!password) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): boolean {
  if (isAuthenticated(req)) return true;
  res.status(401).json({ ok: false, error: "Unauthorized" });
  return false;
}

export function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}
