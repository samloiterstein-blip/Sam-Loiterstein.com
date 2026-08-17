import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getAnalyticsReadToken,
  getAnalyticsSupabase,
  requireAuth,
} from "./_lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  const sb = getAnalyticsSupabase();
  const token = getAnalyticsReadToken();
  if (!sb || !token) {
    res.status(503).json({ ok: false, error: "Analytics store not configured" });
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await sb.rpc("analytics_list_tracking_links", {
      p_token: token,
    });
    if (error) {
      res.status(500).json({ ok: false, error: error.message });
      return;
    }
    res.status(200).json({ ok: true, links: data || [] });
    return;
  }

  if (req.method === "POST") {
    let body: { name?: string; slug?: string };
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch {
      res.status(400).json({ ok: false, error: "Invalid JSON body" });
      return;
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    if (!name || !slug) {
      res.status(400).json({ ok: false, error: "name and slug are required" });
      return;
    }

    const { error } = await sb.rpc("analytics_create_tracking_link", {
      p_token: token,
      p_slug: slug,
      p_name: name,
    });
    if (error) {
      res.status(400).json({ ok: false, error: error.message });
      return;
    }
    res.status(201).json({ ok: true });
    return;
  }

  if (req.method === "DELETE") {
    const slug =
      typeof req.query.slug === "string" ? req.query.slug.trim().toLowerCase() : "";
    if (!slug) {
      res.status(400).json({ ok: false, error: "slug query param required" });
      return;
    }

    const { error } = await sb.rpc("analytics_delete_tracking_link", {
      p_token: token,
      p_slug: slug,
    });
    if (error) {
      res.status(400).json({ ok: false, error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ ok: false, error: "Method not allowed" });
}
