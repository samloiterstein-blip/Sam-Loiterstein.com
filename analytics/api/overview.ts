import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  daysAgoIso,
  getAnalyticsReadToken,
  getAnalyticsSupabase,
  requireAuth,
} from "./_lib/auth.js";

function countBy<T>(rows: T[], keyFn: (row: T) => string | null | undefined) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = keyFn(row) || "(none)";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }
  if (!requireAuth(req, res)) return;

  const sb = getAnalyticsSupabase();
  const token = getAnalyticsReadToken();
  if (!sb || !token) {
    res.status(503).json({ ok: false, error: "Analytics store not configured" });
    return;
  }

  const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
  const since = daysAgoIso(days);

  const [counts, sessions] = await Promise.all([
    sb.rpc("analytics_counts", { p_token: token, p_since: since }),
    sb.rpc("analytics_list_sessions", {
      p_token: token,
      p_since: since,
      p_replay_only: false,
      p_limit: 500,
    }),
  ]);

  if (counts.error) {
    res.status(500).json({ ok: false, error: counts.error.message });
    return;
  }
  if (sessions.error) {
    res.status(500).json({ ok: false, error: sessions.error.message });
    return;
  }

  const sessionRows = (sessions.data || []) as Array<{
    referrer: string | null;
    ua_device: string | null;
    ua_browser: string | null;
  }>;
  const countRow = (counts.data || [])[0] as
    | { visitors: number; pageviews: number }
    | undefined;

  res.status(200).json({
    ok: true,
    days,
    visitors: Number(countRow?.visitors ?? 0),
    sessions: sessionRows.length,
    pageviews: Number(countRow?.pageviews ?? 0),
    referrers: countBy(sessionRows, (s) => {
      if (!s.referrer) return "direct";
      try {
        return new URL(s.referrer).hostname;
      } catch {
        return s.referrer.slice(0, 80);
      }
    }),
    devices: countBy(sessionRows, (s) => s.ua_device),
    browsers: countBy(sessionRows, (s) => s.ua_browser),
  });
}
