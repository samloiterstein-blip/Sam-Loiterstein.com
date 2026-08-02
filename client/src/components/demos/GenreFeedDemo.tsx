import { useCallback, useEffect, useState } from "react";
import { Loader2, MapPin, Music2 } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  connectSpotify,
  disconnectSpotify,
  fetchAppleDeveloperToken,
  fetchDemoFeed,
  fetchGenreFeed,
  fetchMusicStatus,
  fetchSpotifySetup,
  formatEventDate,
  submitAppleTaste,
  type DemoStatus,
  type FeedItem,
} from "@/lib/genreFeedApi";

declare global {
  interface Window {
    MusicKit?: {
      configure: (config: { developerToken: string; app: { name: string; build: string } }) => Promise<unknown>;
      getInstance: () => {
        authorize: () => Promise<string>;
        musicUserToken: string;
      };
    };
  }
}

function loadMusicKit(): Promise<void> {
  if (window.MusicKit) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MusicKit"));
    document.head.appendChild(script);
  });
}

export function GenreFeedDemo() {
  const [status, setStatus] = useState<DemoStatus | null>(null);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [source, setSource] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);
  const [canLoadFeed, setCanLoadFeed] = useState(false);
  const [spotifySetup, setSpotifySetup] = useState<string[] | null>(null);

  const refreshStatus = useCallback(async () => {
    const s = await fetchMusicStatus();
    setStatus(s);
    setCanLoadFeed(s.connected);
    return s;
  }, []);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("music") !== "error") return;

    const reason = params.get("reason");
    void fetchSpotifySetup()
      .then((config) => setSpotifySetup(config.setup))
      .catch(() => setSpotifySetup(null));

    setError(
      reason === "access_denied"
        ? "Spotify authorization was cancelled."
        : "Spotify sign-in failed. This is usually a Redirect URI mismatch in the Spotify Developer Dashboard."
    );
  }, []);

  const loadFeed = useCallback(
    async (useDemo = false) => {
      setLoading(true);
      setError(null);
      setWarning(null);

      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 12_000,
          });
        });

        const { latitude, longitude } = pos.coords;
        setLocationLabel(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);

        const res = useDemo
          ? await fetchDemoFeed(latitude, longitude)
          : await fetchGenreFeed(latitude, longitude);

        if (!res.ok || !res.items) {
          throw new Error(res.error ?? "Could not load feed");
        }

        setItems(res.items);
        setSource(res.source ?? null);
        setWarning(res.warning ?? null);
        if (res.provider) {
          setCanLoadFeed(true);
          setStatus((prev) => ({
            connected: true,
            provider: res.provider ?? prev?.provider ?? null,
            topArtists: res.tasteSummary ?? prev?.topArtists,
            artistCount: res.tasteSummary?.length ?? prev?.artistCount,
            supabase: prev?.supabase,
          }));
        }
      } catch (err) {
        const msg =
          err instanceof GeolocationPositionError
            ? "Location permission is required to find nearby shows."
            : err instanceof Error
              ? err.message
              : "Failed to load feed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const connectApple = async () => {
    setAppleLoading(true);
    setError(null);
    try {
      await loadMusicKit();
      const devToken = await fetchAppleDeveloperToken();
      await window.MusicKit!.configure({
        developerToken: devToken,
        app: { name: "Sam Loiterstein", build: "1.0.0" },
      });
      const music = window.MusicKit!.getInstance();
      const userToken = await music.authorize();
      const result = await submitAppleTaste(userToken);
      if (!result.ok) throw new Error("Apple Music taste import failed");
      await refreshStatus();
      await loadFeed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apple Music connect failed");
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-ink-100 bg-white/80 p-4">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-500">
          <Music2 size={14} />
          Live demo
        </div>
        <p className="mt-1 text-sm text-ink-600">
          Import taste from Spotify or Apple Music, allow location, and see ranked upcoming shows.
        </p>
      </div>

      {status?.supabase && (
        <div
          className={cn(
            "rounded-xl px-3 py-2 text-xs",
            status.supabase.ok
              ? "bg-sage-50/80 text-sage-900"
              : "bg-amber-50 text-amber-900"
          )}
        >
          {status.supabase.ok
            ? `Supabase connected · ${status.supabase.eventCount ?? 0} upcoming events`
            : status.supabase.error ?? "Supabase not connected"}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => connectSpotify()}
          className="rounded-full bg-[#1DB954] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          Import Spotify
        </button>
        <button
          type="button"
          onClick={() => void connectApple()}
          disabled={appleLoading}
          className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-cream hover:bg-ink-800 disabled:opacity-50"
        >
          {appleLoading ? "Connecting…" : "Import Apple Music"}
        </button>
        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={() => void loadFeed(true)}
            className="rounded-full border border-dashed border-ink-200 px-4 py-2 text-xs text-ink-500 hover:border-ink-300"
          >
            Dev: demo taste
          </button>
        )}
      </div>

      {status?.connected && (
        <div className="rounded-xl bg-sage-50/80 px-3 py-2 text-xs text-sage-900">
          Connected via {status.provider}
          {status.topArtists?.length ? ` · ${status.topArtists.join(", ")}` : ""}
          {status.provider === "spotify" && (
            <button
              type="button"
              onClick={() => void disconnectSpotify().then(refreshStatus)}
              className="ml-2 underline"
            >
              Disconnect
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => void loadFeed(false)}
        disabled={loading || !canLoadFeed}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-accent,#ff007f)] px-4 py-2.5 text-sm font-medium text-white transition",
          (!canLoadFeed || loading) && "cursor-not-allowed opacity-50"
        )}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
        {loading ? "Loading feed…" : "Load nearby shows"}
      </button>

      {warning && (
        <p className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">{warning}</p>
      )}

      {error && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <p>{error}</p>
          {spotifySetup && (
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {spotifySetup.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {locationLabel && (
        <p className="text-[10px] text-ink-400">
          Location: {locationLabel}
          {source && ` · Data: ${source}`}
        </p>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-ink-100 bg-cream/50 p-3 text-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium text-ink-900">
                  {item.artistName ?? item.title}
                </div>
                {item.artistName && item.title !== item.artistName && (
                  <div className="text-xs text-ink-500">{item.title}</div>
                )}
              </div>
              <span className="shrink-0 font-mono text-[10px] text-ink-400">
                {item.distanceKm} km
              </span>
            </div>
            <div className="mt-1 text-xs text-ink-600">
              {formatEventDate(item.eventDate)}
              {item.venueCity && ` · ${item.venueCity}${item.venueState ? `, ${item.venueState}` : ""}`}
            </div>
            {item.genres.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {item.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] text-ink-600"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-1.5 text-[10px] text-[var(--brand-accent,#9d0049)]">{item.reason}</p>
            {item.priceRange && (
              <p className="mt-0.5 text-[10px] text-ink-400">{item.priceRange}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
