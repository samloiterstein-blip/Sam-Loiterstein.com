import { Router } from "express";
import {
  ingestCollect,
  ingestReplay,
  isAllowedAnalyticsOrigin,
  parseCollectPayload,
  parseReplayPayload,
} from "../lib/analyticsIngest.js";

const router = Router();

function checkOrigin(
  req: { headers: { origin?: string; [key: string]: unknown } },
  res: { status: (n: number) => { json: (b: unknown) => void } },
  next: () => void
) {
  const origin = req.headers.origin as string | undefined;
  if (!isAllowedAnalyticsOrigin(origin)) {
    res.status(403).json({ ok: false, error: "Origin not allowed" });
    return;
  }
  next();
}

function headerString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

router.post("/collect", checkOrigin, async (req, res) => {
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
});

router.post("/replay", checkOrigin, async (req, res) => {
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
});

export default router;
