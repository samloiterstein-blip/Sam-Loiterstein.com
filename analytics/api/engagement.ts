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

  const { data, error } = await sb.rpc("analytics_list_events", {
    p_token: token,
    p_since: since,
    p_types: ["section_view", "scroll_depth", "click"],
    p_limit: 5000,
  });

  if (error) {
    res.status(500).json({ ok: false, error: error.message });
    return;
  }

  const sections = new Map<string, number>();
  const clicks = new Map<string, number>();
  const scrollBuckets = { "0-25": 0, "26-50": 0, "51-75": 0, "76-100": 0 };

  for (const row of data || []) {
    const props = (row.props || {}) as Record<string, unknown>;
    if (row.type === "section_view" && typeof props.section === "string") {
      sections.set(props.section, (sections.get(props.section) || 0) + 1);
    }
    if (row.type === "click" && typeof props.target === "string") {
      clicks.set(props.target, (clicks.get(props.target) || 0) + 1);
    }
    if (row.type === "scroll_depth" && typeof props.depth === "number") {
      const d = props.depth;
      if (d <= 25) scrollBuckets["0-25"] += 1;
      else if (d <= 50) scrollBuckets["26-50"] += 1;
      else if (d <= 75) scrollBuckets["51-75"] += 1;
      else scrollBuckets["76-100"] += 1;
    }
  }

  res.status(200).json({
    ok: true,
    days,
    sections: [...sections.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    topClicks: [...clicks.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    scrollDepth: Object.entries(scrollBuckets).map(([name, count]) => ({
      name,
      count,
    })),
  });
}
