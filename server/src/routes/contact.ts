import { Router } from "express";
import { handleContactSubmission } from "../lib/contact.js";

const router = Router();

router.post("/", async (req, res) => {
  const result = await handleContactSubmission(req.body ?? {});

  if (!result.ok) {
    return res.status(result.status).json({ ok: false, error: result.error });
  }

  return res.json({ ok: true, ...(result.mocked ? { mocked: true } : {}) });
});

export default router;
