import { Router } from "express";
import crypto from "node:crypto";
import { createAppleDeveloperToken } from "../lib/appleMusicToken.js";
import {
  buildSpotifyAuthUrl,
  createSpotifyPkcePair,
  exchangeSpotifyCode,
  fetchSpotifyTaste,
  getSpotifyRedirectUri,
} from "../lib/spotify.js";

const router = Router();

type AppleHeavyRotation = {
  data?: {
    attributes?: { name?: string };
    relationships?: {
      genres?: { data?: { attributes?: { name?: string } }[] };
    };
  }[];
};

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

function clientBaseUrl(): string {
  return process.env.CLIENT_URL || "http://127.0.0.1:5173";
}

router.get("/spotify/config", (_req, res) => {
  try {
    const redirectUri = getSpotifyRedirectUri();
    res.json({
      redirectUri,
      clientId: process.env.SPOTIFY_CLIENT_ID?.trim() ?? null,
      browseUrl: clientBaseUrl(),
      setup: [
        `In Spotify Developer Dashboard → your app → Settings, add this Redirect URI exactly: ${redirectUri}`,
        "Under User Management, add your Spotify account email (required for Development mode apps).",
        `Browse this site at ${clientBaseUrl()} — not localhost.`,
      ],
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      error: err instanceof Error ? err.message : "Spotify not configured",
    });
  }
});

router.get("/spotify/login", (_req, res) => {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    const { codeVerifier, codeChallenge } = createSpotifyPkcePair();
    res.cookie("spotify_oauth_state", state, { ...COOKIE_OPTS, maxAge: 600_000 });
    res.cookie("spotify_code_verifier", codeVerifier, { ...COOKIE_OPTS, maxAge: 600_000 });
    res.redirect(buildSpotifyAuthUrl(state, codeChallenge));
  } catch (err) {
    console.error("[music] spotify login:", err);
    res.redirect(`${clientBaseUrl()}/?system=genre-intelligence&music=error`);
  }
});

router.get("/spotify/callback", async (req, res) => {
  const { code, state, error } = req.query;
  const savedState = req.cookies?.spotify_oauth_state;
  const codeVerifier = req.cookies?.spotify_code_verifier;

  if (error) {
    res.clearCookie("spotify_oauth_state");
    res.clearCookie("spotify_code_verifier");
    const reason = encodeURIComponent(String(error));
    return res.redirect(`${clientBaseUrl()}/?system=genre-intelligence&music=error&reason=${reason}`);
  }

  if (
    typeof code !== "string" ||
    typeof state !== "string" ||
    state !== savedState ||
    typeof codeVerifier !== "string"
  ) {
    res.clearCookie("spotify_oauth_state");
    res.clearCookie("spotify_code_verifier");
    return res.redirect(`${clientBaseUrl()}/?system=genre-intelligence&music=error&reason=state_mismatch`);
  }

  try {
    const tokens = await exchangeSpotifyCode(code, codeVerifier);
    res.clearCookie("spotify_oauth_state");
    res.clearCookie("spotify_code_verifier");
    res.cookie("spotify_access_token", tokens.access_token, {
      ...COOKIE_OPTS,
      maxAge: tokens.expires_in * 1000,
    });
    if (tokens.refresh_token) {
      res.cookie("spotify_refresh_token", tokens.refresh_token, COOKIE_OPTS);
    }
    res.redirect(`${clientBaseUrl()}/?system=genre-intelligence&music=connected&provider=spotify`);
  } catch (err) {
    console.error("[music] spotify callback:", err);
    res.clearCookie("spotify_oauth_state");
    res.clearCookie("spotify_code_verifier");
    res.redirect(`${clientBaseUrl()}/?system=genre-intelligence&music=error&reason=token_exchange`);
  }
});

router.get("/spotify/status", async (req, res) => {
  const token = req.cookies?.spotify_access_token;
  if (!token) {
    return res.json({ connected: false, provider: null });
  }
  try {
    const taste = await fetchSpotifyTaste(token);
    res.json({
      connected: true,
      provider: "spotify",
      artistCount: taste.length,
      topArtists: taste.slice(0, 5).map((a) => a.name),
    });
  } catch {
    res.json({ connected: false, provider: null });
  }
});

router.post("/spotify/disconnect", (_req, res) => {
  res.clearCookie("spotify_access_token");
  res.clearCookie("spotify_refresh_token");
  res.json({ ok: true });
});

router.get("/apple/developer-token", (_req, res) => {
  try {
    const token = createAppleDeveloperToken();
    res.json({ developerToken: token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Apple Music not configured";
    res.status(503).json({ ok: false, error: message });
  }
});

router.post("/apple/taste", async (req, res) => {
  const { userToken } = req.body as { userToken?: string };
  if (!userToken) {
    return res.status(400).json({ ok: false, error: "Missing userToken" });
  }

  try {
    const devToken = createAppleDeveloperToken();
    const resHeavy = await fetch(
      "https://api.music.apple.com/v1/me/history/heavy-rotation",
      {
        headers: {
          Authorization: `Bearer ${devToken}`,
          "Music-User-Token": userToken,
        },
      }
    );

    if (!resHeavy.ok) {
      const err = await resHeavy.text();
      throw new Error(err);
    }

    const json = (await resHeavy.json()) as AppleHeavyRotation;
    const taste =
      json.data?.map((item, i) => ({
        name: item.attributes?.name ?? "Unknown",
        genres:
          item.relationships?.genres?.data?.map((g) => g.attributes?.name ?? "").filter(Boolean) ??
          [],
        weight: Math.max(0.5 - i * 0.04, 0.15),
      })) ?? [];

    res.cookie("apple_user_token", userToken, COOKIE_OPTS);
    res.cookie("apple_taste", JSON.stringify(taste), COOKIE_OPTS);
    res.json({ ok: true, taste, provider: "apple" });
  } catch (err) {
    console.error("[music] apple taste:", err);
    res.status(502).json({
      ok: false,
      error: err instanceof Error ? err.message : "Apple Music taste fetch failed",
    });
  }
});

export default router;
