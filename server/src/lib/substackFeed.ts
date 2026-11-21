export type SubstackPost = {
  title: string;
  link: string;
  publishedAt: string;
  excerpt: string;
};

export type SubstackFeedPayload = {
  publicationHost: string;
  publicationUrl: string;
  fetchedAt: string;
  posts: SubstackPost[];
  nextCursor?: string | null;
};

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(block: string, tag: string): string {
  const cdata = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i");
  const plain = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i");
  const match = block.match(cdata) ?? block.match(plain);
  return match?.[1]?.trim() ?? "";
}

export function normalizePublicationHost(host: string): string {
  return host
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "");
}

export function publicationUrlFromHost(host: string): string {
  return `https://${normalizePublicationHost(host)}`;
}

export function parseSubstackRss(xml: string, limit = 8): SubstackPost[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  return items
    .slice(0, limit)
    .map(([, block]) => {
      const description = readTag(block!, "description");
      return {
        title: stripHtml(readTag(block!, "title")),
        link: readTag(block!, "link"),
        publishedAt: readTag(block!, "pubDate"),
        excerpt: stripHtml(description).slice(0, 300),
      };
    })
    .filter((post) => post.title.length > 0 && post.link.length > 0);
}

export async function fetchSubstackFeed(host: string, limit = 8): Promise<SubstackFeedPayload> {
  const publicationHost = normalizePublicationHost(host);
  const publicationUrl = publicationUrlFromHost(publicationHost);
  const feedUrl = `${publicationUrl}/feed`;

  const res = await fetch(feedUrl, {
    headers: {
      "User-Agent": "sam-loiterstein.com/1.0 (Substack RSS reader)",
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`Substack feed returned ${res.status} for ${feedUrl}`);
  }

  const xml = await res.text();
  const posts = parseSubstackRss(xml, limit);

  return {
    publicationHost,
    publicationUrl,
    fetchedAt: new Date().toISOString(),
    posts: sortNewest(posts),
    nextCursor: null,
  };
}

const CURSOR_PATTERN = /^[A-Za-z0-9+/=_-]{1,500}$/;

type ArchivePost = {
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  canonical_url?: string;
  post_date?: string;
  truncated_body_text?: string | null;
};

export function sortNewest(posts: SubstackPost[]): SubstackPost[] {
  return [...posts].sort((a, b) => {
    const aTime = new Date(a.publishedAt).getTime();
    const bTime = new Date(b.publishedAt).getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });
}

export function clampPageLimit(value: unknown, fallback = 4): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(20, Math.max(1, Math.floor(parsed)));
}

export async function fetchSubstackPage(
  host: string,
  options: { limit?: number; cursor?: string | null } = {},
): Promise<SubstackFeedPayload> {
  const publicationHost = normalizePublicationHost(host);
  const publicationUrl = publicationUrlFromHost(publicationHost);
  const limit = clampPageLimit(options.limit, 4);
  const cursor = options.cursor && CURSOR_PATTERN.test(options.cursor) ? options.cursor : null;
  const params = new URLSearchParams({ sort: "new", limit: String(limit) });
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${publicationUrl}/api/v1/archive?${params}`, {
    headers: {
      "User-Agent": "sam-loiterstein.com/1.0 (Substack archive reader)",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Substack archive returned ${res.status}`);
  }

  const data = (await res.json()) as { posts?: ArchivePost[]; nextCursor?: string | null };
  const posts = sortNewest(
    (data.posts ?? [])
      .map((post) => {
        const excerptSource = post.subtitle || post.description || post.truncated_body_text || "";
        return {
          title: (post.title ?? "").replace(/\s+/g, " ").trim(),
          link: (post.canonical_url ?? "").trim(),
          publishedAt: post.post_date ?? "",
          excerpt: excerptSource.replace(/\s+/g, " ").trim().slice(0, 300),
        };
      })
      .filter((post) => post.title.length > 0 && post.link.length > 0),
  );
  const nextCursor =
    posts.length >= limit && data.nextCursor && CURSOR_PATTERN.test(data.nextCursor)
      ? data.nextCursor
      : null;

  return {
    publicationHost,
    publicationUrl,
    fetchedAt: new Date().toISOString(),
    posts,
    nextCursor,
  };
}
