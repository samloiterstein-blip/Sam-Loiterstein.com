import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  daysAgoIso,
  getAnalyticsReadToken,
  getAnalyticsSupabase,
  requireAuth,
} from "./_lib/auth.js";

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
  const replayOnly = req.query.replay === "1";

  const { data, error } = await sb.rpc("analytics_list_sessions", {
    p_token: token,
    p_since: since,
    p_replay_only: replayOnly,
    p_limit: 100,
  });

  if (error) {
    res.status(500).json({ ok: false, error: error.message });
    return;
  }

  res.status(200).json({ ok: true, days, sessions: data || [] });
}
