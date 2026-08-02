import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchSubstackFeed } from "../server/src/lib/substackFeed.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const host =
    process.env.SUBSTACK_PUBLICATION?.trim() ||
    process.env.VITE_SUBSTACK_PUBLICATION?.trim() ||
    "sloiterstein.substack.com";

  try {
    const feed = await fetchSubstackFeed(host, 8);
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.json({ ok: true, ...feed });
  } catch (err) {
    console.error("[substack-feed]", err);
    return res.status(502).json({
      ok: false,
      error: "Unable to load Substack feed right now.",
    });
  }
}
