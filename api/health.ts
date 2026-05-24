import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.json({
    ok: true,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
  });
}
