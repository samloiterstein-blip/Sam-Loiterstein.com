import { Router } from "express";
import { clampPageLimit, fetchSubstackPage } from "../lib/substackFeed.js";

const router = Router();

router.get("/", async (req, res) => {
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
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=600");
    res.json({ ok: true, ...feed });
  } catch (err) {
    console.error("[substack-feed]", err);
    res.status(502).json({ ok: false, error: "Unable to load Substack feed right now." });
  }
});

export default router;
