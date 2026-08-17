const SOURCE_KEY = "sl_source";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$|^[a-z0-9]$/;

function normalizeSlug(raw: string | null): string | null {
  if (!raw) return null;
  const slug = raw.trim().toLowerCase().slice(0, 64);
  if (!slug || !SLUG_RE.test(slug)) return null;
  return slug;
}

export function captureSourceFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const fromParam = normalizeSlug(params.get("from"));

  if (fromParam) {
    try {
      sessionStorage.setItem(SOURCE_KEY, fromParam);
    } catch {
      // ignore
    }

    params.delete("from");
    const nextSearch = params.toString();
    const nextUrl =
      window.location.pathname +
      window.location.hash +
      (nextSearch ? `?${nextSearch}` : "");
    window.history.replaceState({}, "", nextUrl || "/");

    return fromParam;
  }

  try {
    return normalizeSlug(sessionStorage.getItem(SOURCE_KEY));
  } catch {
    return null;
  }
}

export function getSessionSource(): string | null {
  try {
    return normalizeSlug(sessionStorage.getItem(SOURCE_KEY));
  } catch {
    return null;
  }
}
