import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clampPageLimit, fetchSubstackPage } from "./_lib/substackFeed.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const host =
    process.env.SUBSTACK_PUBLICATION?.trim() ||
    process.env.VITE_SUBSTACK_PUBLICATION?.trim() ||
    "sloiterstein.substack.com";
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : null;

  try {
    const feed = await fetchSubstackPage(host, {
      limit: clampPageLimit(req.query.limit, 4),
      cursor,
    });
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");
    return res.json({ ok: true, ...feed });
  } catch (err) {
    console.error("[substack-feed]", err);
    return res.status(502).json({
      ok: false,
      error: "Unable to load Substack feed right now.",
    });
  }
}
