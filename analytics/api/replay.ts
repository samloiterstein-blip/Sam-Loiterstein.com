import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
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

  const sessionId =
    typeof req.query.sessionId === "string" ? req.query.sessionId : "";
  if (!sessionId) {
    res.status(400).json({ ok: false, error: "sessionId required" });
    return;
  }

  const { data, error } = await sb.rpc("analytics_list_replay_chunks", {
    p_token: token,
    p_session_id: sessionId,
  });

  if (error) {
    res.status(500).json({ ok: false, error: error.message });
    return;
  }

  const events = (data || []).flatMap((chunk: { payload: unknown }) => {
    const payload = chunk.payload;
    return Array.isArray(payload) ? payload : [];
  });

  res.status(200).json({ ok: true, sessionId, events });
}
