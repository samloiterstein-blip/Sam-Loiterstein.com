import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSessionCookie, verifyPassword } from "./_lib/auth.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const password =
    typeof req.body?.password === "string" ? req.body.password : "";
  if (!verifyPassword(password)) {
    res.status(401).json({ ok: false, error: "Invalid password" });
    return;
  }

  const cookie = createSessionCookie();
  if (!cookie) {
    res.status(503).json({ ok: false, error: "Auth not configured" });
    return;
  }

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ ok: true });
}
