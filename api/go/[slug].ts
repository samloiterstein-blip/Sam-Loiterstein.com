import type { VercelRequest, VercelResponse } from "@vercel/node";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$|^[a-z0-9]$/;

export default function handler(req: VercelRequest, res: VercelResponse) {
  const raw = typeof req.query.slug === "string" ? req.query.slug : "";
  const slug = raw.trim().toLowerCase();

  if (!slug || !SLUG_RE.test(slug)) {
    res.status(404).send("Not found");
    return;
  }

  const host =
    typeof req.headers["x-forwarded-host"] === "string"
      ? req.headers["x-forwarded-host"]
      : req.headers.host || "sam-loiterstein.com";
  const proto =
    typeof req.headers["x-forwarded-proto"] === "string"
      ? req.headers["x-forwarded-proto"]
      : "https";

  res
    .status(302)
    .setHeader("Location", `${proto}://${host}/?from=${encodeURIComponent(slug)}`)
    .setHeader("Cache-Control", "no-store")
    .end();
}
