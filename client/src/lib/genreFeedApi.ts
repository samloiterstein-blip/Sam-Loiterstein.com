export type FeedItem = {
  id: string;
  title: string;
  artistName: string | null;
  venueCity: string | null;
  venueState: string | null;
  eventDate: string;
  genres: string[];
  distanceKm: number;
  score: number;
  reason: string;
  priceRange: string | null;
  ticketAvailable: boolean;
};

export type MusicStatus = {
  connected: boolean;
  provider: string | null;
  artistCount?: number;
  topArtists?: string[];
};

export type FeedResponse = {
  ok: boolean;
  items?: FeedItem[];
  source?: "supabase" | "mock";
  provider?: string | null;
  tasteSummary?: string[];
  warning?: string;
  error?: string;
};

export type DemoStatus = MusicStatus & {
  supabase?: {
    ok: boolean;
    keyType?: string;
    eventCount?: number;
    error?: string;
  };
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  return res.json() as Promise<T>;
}

export function connectSpotify(): void {
  window.location.href = "/api/music/spotify/login";
}

export async function fetchSpotifySetup(): Promise<{
  redirectUri: string;
  clientId: string | null;
  browseUrl: string;
  setup: string[];
}> {
  return api("/api/music/spotify/config");
}

export async function fetchMusicStatus(): Promise<DemoStatus> {
  return api<DemoStatus>("/api/demo/genre/status");
}

export async function fetchSupabaseHealth(): Promise<{
  ok: boolean;
  supabase: DemoStatus["supabase"];
}> {
  return api("/api/demo/genre/health");
}

export async function fetchGenreFeed(lat: number, lng: number, radiusKm = 80): Promise<FeedResponse> {
  return api<FeedResponse>("/api/demo/genre/feed", {
    method: "POST",
    body: JSON.stringify({ lat, lng, radiusKm }),
  });
}

export async function fetchDemoFeed(lat: number, lng: number, radiusKm = 80): Promise<FeedResponse> {
  return api<FeedResponse>("/api/demo/genre/feed/demo", {
    method: "POST",
    body: JSON.stringify({ lat, lng, radiusKm }),
  });
}

export async function disconnectSpotify(): Promise<void> {
  await api("/api/music/spotify/disconnect", { method: "POST" });
}

export async function fetchAppleDeveloperToken(): Promise<string> {
  const res = await api<{ developerToken?: string; error?: string }>(
    "/api/music/apple/developer-token"
  );
  if (!res.developerToken) throw new Error(res.error ?? "No developer token");
  return res.developerToken;
}

export async function submitAppleTaste(userToken: string): Promise<{ ok: boolean; taste?: unknown[] }> {
  return api("/api/music/apple/taste", {
    method: "POST",
    body: JSON.stringify({ userToken }),
  });
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
