import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ingestCollect,
  isAllowedAnalyticsOrigin,
  parseCollectPayload,
} from "../_lib/analyticsStore.js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "256kb",
    },
  },
};

function headerString(
  value: string | string[] | undefined
): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
  if (!isAllowedAnalyticsOrigin(origin)) {
    res.status(403).json({ ok: false, error: "Origin not allowed" });
    return;
  }

  const payload = parseCollectPayload(req.body);
  if (!payload) {
    res.status(400).json({ ok: false, error: "Invalid payload" });
    return;
  }

  const geo = {
    country: headerString(req.headers["x-vercel-ip-country"]),
    region: headerString(req.headers["x-vercel-ip-country-region"]),
    city: headerString(req.headers["x-vercel-ip-city"]),
  };

  const result = await ingestCollect(payload, geo);
  if (!result.ok) {
    const status = result.error.includes("not configured") ? 503 : 500;
    res.status(status).json({ ok: false, error: result.error });
    return;
  }

  res.status(204).end();
}
