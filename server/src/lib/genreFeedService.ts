import {
  getSupabase,
  isLegacyKeyDisabledError,
  testSupabaseConnection,
} from "./supabase.js";
import type { TasteArtist } from "./spotify.js";

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

type GenreJoin = { genres: { name: string } | { name: string }[] | null };

type RawEvent = {
  id: string;
  title: string;
  event_date: string;
  genres: string[] | null;
  venue_city: string | null;
  venue_state: string | null;
  latitude: number | null;
  longitude: number | null;
  price_range: string | null;
  ticket_available: boolean | null;
  artist_id: string | null;
  artists?: { name: string } | { name: string }[] | null;
  events_genres?: GenreJoin[] | null;
};

const MOCK_EVENTS: RawEvent[] = [
  {
    id: "mock-1",
    title: "Bon Iver",
    event_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    genres: ["indie folk", "art pop"],
    venue_city: "Washington",
    venue_state: "DC",
    latitude: 38.9072,
    longitude: -77.0369,
    price_range: "$45–$85",
    ticket_available: true,
    artist_id: null,
    artists: { name: "Bon Iver" },
  },
  {
    id: "mock-2",
    title: "Khruangbin",
    event_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    genres: ["psychedelic soul", "funk"],
    venue_city: "Washington",
    venue_state: "DC",
    latitude: 38.88,
    longitude: -77.05,
    price_range: "$35–$65",
    ticket_available: true,
    artist_id: null,
    artists: { name: "Khruangbin" },
  },
  {
    id: "mock-3",
    title: "The National",
    event_date: new Date(Date.now() + 21 * 86400000).toISOString(),
    genres: ["indie rock", "alternative rock"],
    venue_city: "Arlington",
    venue_state: "VA",
    latitude: 38.8816,
    longitude: -77.091,
    price_range: "$55–$120",
    ticket_available: true,
    artist_id: null,
    artists: { name: "The National" },
  },
  {
    id: "mock-4",
    title: "Fred again..",
    event_date: new Date(Date.now() + 10 * 86400000).toISOString(),
    genres: ["house", "electronic"],
    venue_city: "Washington",
    venue_state: "DC",
    latitude: 38.895,
    longitude: -77.02,
    price_range: "$40–$90",
    ticket_available: true,
    artist_id: null,
    artists: { name: "Fred again.." },
  },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function artistNameFromRow(row: RawEvent): string | null {
  if (!row.artists) return null;
  if (Array.isArray(row.artists)) return row.artists[0]?.name ?? null;
  return row.artists.name ?? null;
}

function genresFromRow(row: RawEvent): string[] {
  const fromArray = row.genres ?? [];
  const fromJoin: string[] = [];

  for (const link of row.events_genres ?? []) {
    const g = link.genres;
    if (!g) continue;
    if (Array.isArray(g)) {
      for (const item of g) {
        if (item.name) fromJoin.push(item.name);
      }
    } else if (g.name) {
      fromJoin.push(g.name);
    }
  }

  return [...new Set([...fromArray, ...fromJoin])];
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function genreOverlap(eventGenres: string[], tasteGenres: string[]): string[] {
  const taste = tasteGenres.map(normalize);
  return eventGenres.filter((g) => {
    const n = normalize(g);
    return taste.some((t) => n.includes(t) || t.includes(n));
  });
}

function scoreEvent(
  row: RawEvent,
  lat: number,
  lng: number,
  taste: TasteArtist[]
): { score: number; reason: string } {
  const artistName = artistNameFromRow(row);
  const titleNorm = normalize(row.title);
  const allTasteGenres = taste.flatMap((t) => t.genres);
  const eventGenres = genresFromRow(row);

  let score = 0;
  let matchedArtist: TasteArtist | null = null;

  for (const t of taste) {
    const nameNorm = normalize(t.name);
    if (
      titleNorm.includes(nameNorm) ||
      (artistName && normalize(artistName).includes(nameNorm))
    ) {
      score += 40 * t.weight;
      matchedArtist = t;
      break;
    }
  }

  const overlaps = genreOverlap(eventGenres, allTasteGenres);
  score += overlaps.length * 12;

  if (row.latitude != null && row.longitude != null) {
    const dist = haversineKm(lat, lng, Number(row.latitude), Number(row.longitude));
    score += Math.max(0, 25 - dist * 0.4);
  }

  if (row.ticket_available) score += 3;

  let reason: string;
  if (matchedArtist) {
    reason = `Because you listen to ${matchedArtist.name}`;
  } else if (overlaps.length > 0) {
    reason = `Matches your taste in ${overlaps.slice(0, 2).join(", ")}`;
  } else {
    reason = "Nearby upcoming show";
  }

  return { score, reason };
}

async function fetchEventsNear(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<{ events: RawEvent[]; source: "supabase" | "mock"; warning?: string }> {
  const sb = getSupabase();
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  const now = new Date().toISOString();

  if (sb) {
    const { data, error } = await sb
      .from("events")
      .select(
        `id, title, event_date, genres, venue_city, venue_state, latitude, longitude,
         price_range, ticket_available, artist_id,
         artists(name),
         events_genres(genres(name))`
      )
      .gte("event_date", now)
      .gte("latitude", lat - latDelta)
      .lte("latitude", lat + latDelta)
      .gte("longitude", lng - lngDelta)
      .lte("longitude", lng + lngDelta)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("event_date", { ascending: true })
      .limit(120);

    if (!error && data && data.length > 0) {
      return { events: data as RawEvent[], source: "supabase" };
    }

    if (error) {
      const msg = error.message;
      console.warn("[genreFeed] Supabase query failed:", msg);
      const warning = isLegacyKeyDisabledError(msg)
        ? "Supabase legacy keys disabled — set SUPABASE_SECRET_KEY (sb_secret_…) in server/.env"
        : msg;
      return { events: MOCK_EVENTS, source: "mock", warning };
    }

    if (!data?.length) {
      return {
        events: MOCK_EVENTS,
        source: "mock",
        warning: "No upcoming geotagged events in this area — showing sample feed",
      };
    }
  }

  return {
    events: MOCK_EVENTS,
    source: "mock",
    warning: "Supabase not configured — paste sb_secret key into server/.env",
  };
}

export async function buildGenreFeed(params: {
  lat: number;
  lng: number;
  radiusKm?: number;
  taste: TasteArtist[];
  limit?: number;
}): Promise<{ items: FeedItem[]; source: "supabase" | "mock"; warning?: string }> {
  const { lat, lng, taste, limit = 12 } = params;
  const radiusKm = params.radiusKm ?? 80;

  const { events, source, warning } = await fetchEventsNear(lat, lng, radiusKm);

  const items: FeedItem[] = events
    .map((row) => {
      const dist =
        row.latitude != null && row.longitude != null
          ? haversineKm(lat, lng, Number(row.latitude), Number(row.longitude))
          : 999;
      const { score, reason } = scoreEvent(row, lat, lng, taste);
      const mergedGenres = genresFromRow(row);

      return {
        id: row.id,
        title: row.title,
        artistName: artistNameFromRow(row),
        venueCity: row.venue_city,
        venueState: row.venue_state,
        eventDate: row.event_date,
        genres: mergedGenres,
        distanceKm: Math.round(dist * 10) / 10,
        score: Math.round(score * 10) / 10,
        reason,
        priceRange: row.price_range,
        ticketAvailable: row.ticket_available ?? false,
      };
    })
    .filter((e) => e.distanceKm <= radiusKm)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return { items, source, warning };
}

export { testSupabaseConnection };
