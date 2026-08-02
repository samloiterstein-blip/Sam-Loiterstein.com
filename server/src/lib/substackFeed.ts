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
    posts,
  };
}
