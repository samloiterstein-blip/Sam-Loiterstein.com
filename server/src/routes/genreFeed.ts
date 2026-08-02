import { Router } from "express";
import {
  buildGenreFeed,
  testSupabaseConnection,
} from "../lib/genreFeedService.js";
import { fetchSpotifyTaste, type TasteArtist } from "../lib/spotify.js";

const router = Router();

router.get("/health", async (_req, res) => {
  const supabase = await testSupabaseConnection();
  res.json({
    ok: supabase.ok,
    supabase,
  });
});

async function tasteFromCookies(req: {
  cookies?: Record<string, string>;
}): Promise<{ taste: TasteArtist[]; provider: string | null }> {
  const spotifyToken = req.cookies?.spotify_access_token;
  if (spotifyToken) {
    const taste = await fetchSpotifyTaste(spotifyToken);
    return { taste, provider: "spotify" };
  }

  const appleTasteRaw = req.cookies?.apple_taste;
  if (appleTasteRaw) {
    try {
      const taste = JSON.parse(appleTasteRaw) as TasteArtist[];
      if (taste.length) return { taste, provider: "apple" };
    } catch {
      /* ignore */
    }
  }

  return { taste: [], provider: null };
}

router.get("/status", async (req, res) => {
  try {
    const { taste, provider } = await tasteFromCookies(req);
    const supabase = await testSupabaseConnection();
    res.json({
      connected: taste.length > 0,
      provider,
      artistCount: taste.length,
      topArtists: taste.slice(0, 5).map((a) => a.name),
      supabase,
    });
  } catch {
    res.json({ connected: false, provider: null, artistCount: 0, topArtists: [] });
  }
});

router.post("/feed", async (req, res) => {
  const { lat, lng, radiusKm, taste: bodyTaste } = req.body as {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    taste?: TasteArtist[];
  };

  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ ok: false, error: "lat and lng are required" });
  }

  try {
    let taste = bodyTaste;
    let provider: string | null = bodyTaste ? "manual" : null;

    if (!taste?.length) {
      const fromCookie = await tasteFromCookies(req);
      taste = fromCookie.taste;
      provider = fromCookie.provider;
    }

    if (!taste.length) {
      return res.status(401).json({
        ok: false,
        error: "Connect Spotify or Apple Music first",
      });
    }

    const { items, source, warning } = await buildGenreFeed({
      lat,
      lng,
      radiusKm,
      taste,
    });

    res.json({
      ok: true,
      items,
      source,
      warning,
      provider,
      tasteSummary: taste.slice(0, 5).map((a) => a.name),
    });
  } catch (err) {
    console.error("[genreFeed]", err);
    res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : "Feed generation failed",
    });
  }
});

router.post("/feed/demo", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ ok: false });
  }

  const { lat, lng, radiusKm } = req.body as {
    lat?: number;
    lng?: number;
    radiusKm?: number;
  };

  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ ok: false, error: "lat and lng are required" });
  }

  const demoTaste: TasteArtist[] = [
    { name: "Bon Iver", genres: ["indie folk", "art pop"], weight: 0.9 },
    { name: "The National", genres: ["indie rock", "alternative rock"], weight: 0.75 },
    { name: "Fred again..", genres: ["house", "electronic"], weight: 0.6 },
  ];

  const { items, source, warning } = await buildGenreFeed({
    lat,
    lng,
    radiusKm,
    taste: demoTaste,
  });

  res.json({
    ok: true,
    items,
    source,
    warning,
    provider: "demo",
    tasteSummary: demoTaste.map((a) => a.name),
  });
});

export default router;
