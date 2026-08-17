import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getAnalyticsReadToken,
  getAnalyticsSupabase,
  requireAuth,
} from "./_lib/auth.js";

function parseDateStart(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseDateEndExclusive(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

function resolveRange(query: VercelRequest["query"]): {
  since: string;
  until: string | null;
  label: string;
} {
  const range =
    typeof query.range === "string" ? query.range.trim().toLowerCase() : "";
  const from = typeof query.from === "string" ? query.from.trim() : "";
  const to = typeof query.to === "string" ? query.to.trim() : "";

  if (range === "all") {
    return {
      since: "1970-01-01T00:00:00.000Z",
      until: null,
      label: "all",
    };
  }

  if (range === "custom" || (from && to)) {
    const start = parseDateStart(from);
    const end = parseDateEndExclusive(to || from);
    if (!start || !end || start >= end) {
      throw new Error("Invalid custom date range (use from=YYYY-MM-DD&to=YYYY-MM-DD)");
    }
    // Cap custom range at 2 years
    const maxMs = 730 * 86400000;
    if (end.getTime() - start.getTime() > maxMs) {
      throw new Error("Custom range cannot exceed 730 days");
    }
    return {
      since: start.toISOString(),
      until: end.toISOString(),
      label: "custom",
    };
  }

  const preset = Number(range || query.days || 30);
  const days = [7, 30, 90].includes(preset) ? preset : 30;
  return {
    since: new Date(Date.now() - days * 86400000).toISOString(),
    until: null,
    label: String(days),
  };
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

  let range;
  try {
    range = resolveRange(req.query);
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err instanceof Error ? err.message : "Invalid range",
    });
    return;
  }

  const { data, error } = await sb.rpc("analytics_dashboard", {
    p_token: token,
    p_since: range.since,
    p_until: range.until,
  });

  if (error) {
    res.status(500).json({ ok: false, error: error.message });
    return;
  }

  res.status(200).json({
    ok: true,
    range: range.label,
    since: range.since,
    until: range.until,
    ...(data || {}),
  });
}
