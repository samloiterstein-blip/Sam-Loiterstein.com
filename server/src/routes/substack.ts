import { Router } from "express";
import { fetchSubstackFeed } from "../lib/substackFeed.js";

const router = Router();

router.get("/", async (_req, res) => {
  const host =
    process.env.SUBSTACK_PUBLICATION?.trim() ||
    process.env.VITE_SUBSTACK_PUBLICATION?.trim() ||
    "sloiterstein.substack.com";

  try {
    const feed = await fetchSubstackFeed(host, 8);
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.json({ ok: true, ...feed });
  } catch (err) {
    console.error("[substack-feed]", err);
    res.status(502).json({ ok: false, error: "Unable to load Substack feed right now." });
  }
});

export default router;
