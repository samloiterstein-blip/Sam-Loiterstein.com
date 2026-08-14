import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearSessionCookie } from "./_lib/auth.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.status(200).json({ ok: true });
}
