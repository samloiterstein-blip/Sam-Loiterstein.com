import crypto from "node:crypto";

const SPOTIFY_AUTH = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN = "https://accounts.spotify.com/api/token";
const SPOTIFY_API = "https://api.spotify.com/v1";

const SCOPES = [
  "user-top-read",
  "user-read-recently-played",
].join(" ");

export type TasteArtist = {
  name: string;
  genres: string[];
  weight: number;
};

function spotifyConfig() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI?.trim() ||
    `${(process.env.CLIENT_URL || "http://127.0.0.1:5173").replace(/\/$/, "")}/api/music/spotify/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify OAuth is not configured");
  }
  return { clientId, clientSecret, redirectUri };
}

export function getSpotifyRedirectUri(): string {
  return spotifyConfig().redirectUri;
}

export function createSpotifyPkcePair(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = crypto.randomBytes(64).toString("base64url").slice(0, 96);
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
  return { codeVerifier, codeChallenge };
}

export function buildSpotifyAuthUrl(state: string, codeChallenge: string): string {
  const { clientId, redirectUri } = spotifyConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SCOPES,
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });
  return `${SPOTIFY_AUTH}?${params.toString()}`;
}

export async function exchangeSpotifyCode(
  code: string,
  codeVerifier: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const { clientId, clientSecret, redirectUri } = spotifyConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(SPOTIFY_TOKEN, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Spotify token exchange failed: ${err}`);
  }

  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>;
}

async function spotifyGet<T>(accessToken: string, path: string): Promise<T> {
  const res = await fetch(`${SPOTIFY_API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Spotify API error: ${err}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchSpotifyTaste(accessToken: string): Promise<TasteArtist[]> {
  type ArtistItem = { name: string; genres?: string[] };
  type TopResponse = { items: { name: string; genres?: string[] }[] };
  type RecentResponse = { items: { track: { artists: ArtistItem[] } }[] };

  const [topShort, topMedium, recent] = await Promise.all([
    spotifyGet<TopResponse>(accessToken, "/me/top/artists?limit=10&time_range=short_term"),
    spotifyGet<TopResponse>(accessToken, "/me/top/artists?limit=15&time_range=medium_term"),
    spotifyGet<RecentResponse>(accessToken, "/me/player/recently-played?limit=20"),
  ]);

  const map = new Map<string, TasteArtist>();

  topMedium.items.forEach((a, i) => {
    const weight = 0.55 - i * 0.02;
    map.set(a.name.toLowerCase(), {
      name: a.name,
      genres: a.genres ?? [],
      weight: Math.max(weight, 0.25),
    });
  });

  topShort.items.forEach((a, i) => {
    const key = a.name.toLowerCase();
    const existing = map.get(key);
    const weight = 0.35 - i * 0.015;
    if (existing) {
      existing.weight += Math.max(weight, 0.12);
      existing.genres = [...new Set([...existing.genres, ...(a.genres ?? [])])];
    } else {
      map.set(key, {
        name: a.name,
        genres: a.genres ?? [],
        weight: Math.max(weight, 0.12),
      });
    }
  });

  recent.items.forEach((item) => {
    for (const artist of item.track.artists) {
      const key = artist.name.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.weight += 0.08;
      } else {
        map.set(key, {
          name: artist.name,
          genres: artist.genres ?? [],
          weight: 0.1,
        });
      }
    }
  });

  return [...map.values()].sort((a, b) => b.weight - a.weight).slice(0, 25);
}
