import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ingestReplay,
  isAllowedAnalyticsOrigin,
  parseReplayPayload,
} from "../_lib/analyticsStore.js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

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

  const payload = parseReplayPayload(req.body);
  if (!payload) {
    res.status(400).json({ ok: false, error: "Invalid payload" });
    return;
  }

  const result = await ingestReplay(payload);
  if (!result.ok) {
    const status =
      result.status ??
      (result.error.includes("not configured") ? 503 : 500);
    res.status(status).json({ ok: false, error: result.error });
    return;
  }

  res.status(204).end();
}
