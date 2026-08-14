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
  const path =
    typeof req.query.path === "string" && req.query.path
      ? req.query.path
      : "/";
  const since = daysAgoIso(days);

  const [pointsRes, allRes] = await Promise.all([
    sb.rpc("analytics_list_clicks", {
      p_token: token,
      p_since: since,
      p_path: path,
      p_limit: 5000,
    }),
    sb.rpc("analytics_list_clicks", {
      p_token: token,
      p_since: since,
      p_path: null,
      p_limit: 2000,
    }),
  ]);

  if (pointsRes.error) {
    res.status(500).json({ ok: false, error: pointsRes.error.message });
    return;
  }
  if (allRes.error) {
    res.status(500).json({ ok: false, error: allRes.error.message });
    return;
  }

  const pathCounts = new Map<string, number>();
  for (const row of allRes.data || []) {
    pathCounts.set(row.path, (pathCounts.get(row.path) || 0) + 1);
  }

  res.status(200).json({
    ok: true,
    days,
    path,
    points: (pointsRes.data || []).map((c: { x_pct: number; y_pct: number; target: string | null }) => ({
      x: c.x_pct,
      y: c.y_pct,
      target: c.target,
    })),
    paths: [...pathCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  });
}
