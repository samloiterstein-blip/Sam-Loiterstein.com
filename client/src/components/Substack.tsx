import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionCta } from "./SectionCta";
import { media, site, substack, writingSection, type MediaItem } from "@/data/content";

export type SubstackPost = {
  title: string;
  link: string;
  publishedAt: string;
  excerpt: string;
};

type FeedPayload = {
  publicationHost: string;
  publicationUrl: string;
  fetchedAt: string;
  posts: SubstackPost[];
  nextCursor?: string | null;
};

type TimelineItem = {
  id: string;
  kind: "note" | "press";
  time: number;
  primary: string;
  year: string;
  dateTime?: string;
  title: string;
  href?: string;
  excerpt?: string;
  source: string;
  badge: string;
};

const pressTone: Record<MediaItem["type"], string> = {
  Article: "border-sage-200 bg-sage-50 text-sage-800",
  Podcast: "border-amber-200 bg-amber-50 text-amber-800",
  Mention: "border-ink-200 bg-ink-50 text-ink-700",
  Interview: "border-sage-300 bg-sage-100 text-sage-900",
};

function sortNewest(posts: SubstackPost[]): SubstackPost[] {
  return [...posts].sort((a, b) => noteTime(b.publishedAt) - noteTime(a.publishedAt));
}

function mergePosts(current: SubstackPost[], incoming: SubstackPost[]): SubstackPost[] {
  const byLink = new Map<string, SubstackPost>();
  for (const post of current) byLink.set(post.link, post);
  for (const post of incoming) byLink.set(post.link, post);
  return sortNewest([...byLink.values()]);
}

function noteTime(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function pressTime(date?: string): number {
  if (!date) return 0;
  const yearOnly = /^(\d{4})$/.exec(date.trim());
  if (yearOnly) return Date.UTC(Number(yearOnly[1]), 0, 1);
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function compactDate(time: number, raw?: string): { primary: string; year: string } {
  if (raw && /^\d{4}$/.test(raw.trim())) return { primary: raw.trim(), year: "" };
  if (!time) return { primary: raw?.trim() || "", year: "" };
  const date = new Date(time);
  return {
    primary: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    year: String(date.getFullYear()),
  };
}

function pressItems(): TimelineItem[] {
  return media.map((item) => {
    const time = pressTime(item.date);
    const label = compactDate(time, item.date);
    return {
      id: `${item.outlet}-${item.title}`,
      kind: "press",
      time,
      primary: label.primary,
      year: label.year,
      dateTime: item.date,
      title: item.title,
      href: item.href,
      source: item.outlet,
      badge: item.type,
    };
  });
}

function noteItems(posts: SubstackPost[]): TimelineItem[] {
  return posts.map((post) => {
    const time = noteTime(post.publishedAt);
    const label = compactDate(time);
    return {
      id: post.link,
      kind: "note",
      time,
      primary: label.primary,
      year: label.year,
      dateTime: post.publishedAt,
      title: post.title,
      href: post.link,
      excerpt: post.excerpt,
      source: "Substack",
      badge: "Note",
    };
  });
}

type FeedPair = {
  id: string;
  note?: TimelineItem;
  press?: TimelineItem;
};

function buildPairs(posts: SubstackPost[], notesDone: boolean): FeedPair[] {
  const notes = noteItems(posts);
  if (!notesDone && notes.length === 0) return [];

  const press = pressItems().sort((a, b) => b.time - a.time || a.title.localeCompare(b.title));
  const count = Math.max(notes.length, press.length);
  const pairs: FeedPair[] = [];
  for (let index = 0; index < count; index += 1) {
    const note = notes[index];
    const item = press[index];
    if (!note && !item) continue;
    pairs.push({ id: `${note?.id ?? "gap"}::${item?.id ?? "gap"}`, note, press: item });
  }
  return pairs;
}

function FeedCell({ item, className }: { item: TimelineItem; className?: string }) {
  const tone =
    item.kind === "note" ? "border-sage-200 bg-sage-50 text-sage-800" : pressTone[item.badge as MediaItem["type"]];
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${tone}`}
        >
          {item.badge}
        </span>
        <time dateTime={item.dateTime} className="text-[11px] uppercase tracking-[0.12em] text-ink-400">
          {item.primary}
          {item.year ? ` ${item.year}` : ""}
        </time>
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-ink-500">{item.source}</p>
      <h3 className="mt-1 font-display text-lg leading-snug text-ink-900">{item.title}</h3>
      {item.excerpt ? <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-600">{item.excerpt}</p> : null}
      {item.href ? (
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-sage-800">
          {item.kind === "note" ? substack.readLabel : "Read"}
          <ArrowUpRight
            size={14}
            className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      ) : null}
    </>
  );

  const frame = `min-w-0 px-4 py-4 sm:px-5 ${className ?? ""}`;
  if (!item.href) return <div className={frame}>{body}</div>;
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`group block transition hover:bg-white/70 ${frame}`}>
      {body}
    </a>
  );
}

async function loadStaticPage(cursor: string | null): Promise<FeedPayload | null> {
  const offsetMatch = cursor?.match(/^offset:(\d+)$/);
  const start = offsetMatch ? Number(offsetMatch[1]) : 0;
  const staticRes = await fetch(substack.feedPath);
  if (!staticRes.ok) return null;
  const data = (await staticRes.json()) as FeedPayload;
  const sorted = sortNewest(data.posts ?? []);
  const posts = sorted.slice(start, start + substack.pageSize);
  const next = start + posts.length;
  return {
    ...data,
    posts,
    nextCursor: next < sorted.length ? `offset:${next}` : null,
  };
}

async function loadSubstackPage(cursor: string | null): Promise<FeedPayload | null> {
  if (!cursor?.startsWith("offset:")) {
    try {
      const params = new URLSearchParams({ limit: String(substack.pageSize) });
      if (cursor) params.set("cursor", cursor);
      const apiRes = await fetch(`${substack.apiPath}?${params}`, { cache: "no-store" });
      if (apiRes.ok) {
        const data = (await apiRes.json()) as FeedPayload & { ok?: boolean };
        if (Array.isArray(data.posts)) {
          return {
            publicationHost: data.publicationHost,
            publicationUrl: data.publicationUrl,
            fetchedAt: data.fetchedAt,
            posts: data.posts,
            nextCursor: data.posts.length > 0 ? data.nextCursor ?? null : null,
          };
        }
      }
    } catch {
      // The first page can fall back to the build snapshot.
    }
    if (cursor) return null;
  }

  try {
    return await loadStaticPage(cursor);
  } catch {
    return null;
  }
}

export function SubstackWriting() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [notesDone, setNotesDone] = useState(false);
  const [shown, setShown] = useState<number>(substack.pageSize);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const shownRef = useRef<number>(substack.pageSize);
  const timelineCountRef = useRef(0);

  const canonicalPubUrl = substack.publicationUrl;
  const pairs = useMemo(() => buildPairs(posts, notesDone), [posts, notesDone]);
  const visible = pairs.slice(0, shown);
  timelineCountRef.current = pairs.length;

  const loadMore = useCallback(async (initial: boolean) => {
    if (loadingRef.current) return;
    if (!initial && !hasMoreRef.current) return;

    loadingRef.current = true;
    if (initial) setLoading(true);
    else setLoadingMore(true);

    try {
      const page = await loadSubstackPage(initial ? null : cursorRef.current);
      if (!page) {
        hasMoreRef.current = false;
        setNotesDone(true);
        return;
      }

      if (initial) {
        shownRef.current = substack.pageSize;
        setShown(substack.pageSize);
      }

      setPosts((current) => (initial ? sortNewest(page.posts) : mergePosts(current, page.posts)));
      const nextCursor = page.nextCursor ?? null;
      cursorRef.current = nextCursor;
      hasMoreRef.current = Boolean(nextCursor);
      setNotesDone(!nextCursor);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const revealMore = useCallback(() => {
    if (loadingRef.current) return;
    if (shownRef.current < timelineCountRef.current) {
      const next = Math.min(timelineCountRef.current, shownRef.current + substack.pageSize);
      shownRef.current = next;
      setShown(next);
      return;
    }
    if (hasMoreRef.current) void loadMore(false);
  }, [loadMore]);

  useEffect(() => {
    void loadMore(true);
  }, [loadMore]);

  useEffect(() => {
    const root = scrollerRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) revealMore();
      },
      { root, rootMargin: "48px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [revealMore, loading, loadingMore, posts.length, shown, notesDone]);

  const schema = useMemo(() => {
    const indexed = posts.slice(0, 12);
    if (!indexed.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: substack.title,
      description: substack.description,
      url: canonicalPubUrl,
      author: {
        "@type": "Person",
        name: site.name,
        url: "https://sam-loiterstein.com",
        sameAs: [substack.profileUrl, canonicalPubUrl],
      },
      publisher: {
        "@type": "Person",
        name: site.name,
      },
      blogPost: indexed.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: post.link,
        datePublished: post.publishedAt,
        description: post.excerpt,
        author: { "@type": "Person", name: site.name },
        mainEntityOfPage: post.link,
        isPartOf: { "@type": "Blog", url: canonicalPubUrl },
      })),
    };
  }, [posts, canonicalPubUrl]);

  return (
    <section id="writing" className="py-12 sm:py-14 lg:py-16">
      <div className="container-page">
        {schema ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ) : null}

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <span className="eyebrow">{writingSection.eyebrow}</span>
            <h2 className="heading mt-5">{writingSection.title}</h2>
            <p className="subheading">{writingSection.description}</p>
          </div>
          <a
            href={canonicalPubUrl}
            target="_blank"
            rel="noopener noreferrer author"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-800 hover:text-sage-900"
          >
            {substack.publicationHost}
            <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>

        <SectionCta place="writing" href={posts[0]?.link} />

        {loading ? <p className="text-sm text-ink-500">Loading recent posts.</p> : null}

        {!loading && visible.length > 0 ? (
          <div
            id="media"
            ref={scrollerRef}
            tabIndex={0}
            aria-label="Notes and press, newest of each first"
            className="h-[32rem] overflow-y-auto overscroll-contain rounded-2xl border border-ink-100 bg-white shadow-soft focus-visible:ring-offset-0"
          >
            <div className="sticky top-0 z-10 hidden border-b border-ink-100 bg-white/95 backdrop-blur md:grid md:grid-cols-2">
              <p className="px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">Notes</p>
              <p className="border-l border-ink-100 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">
                In the press
              </p>
            </div>
            <ol>
              {visible.map((pair) => (
                <li key={pair.id} className="grid border-b border-ink-100 md:grid-cols-2">
                  {pair.note ? (
                    <FeedCell item={pair.note} className="order-2 md:order-1" />
                  ) : (
                    <div className="hidden md:block" />
                  )}
                  {pair.press ? (
                    <FeedCell
                      item={pair.press}
                      className="order-1 border-b border-ink-100 bg-sage-50/60 md:order-2 md:border-b-0 md:border-l"
                    />
                  ) : (
                    <div className="hidden bg-sage-50/40 md:block md:border-l md:border-ink-100" />
                  )}
                </li>
              ))}
              <li ref={sentinelRef} aria-hidden className="h-px" />
            </ol>
            {loadingMore ? <p className="px-5 py-3 text-sm text-ink-500">{substack.loadingMore}</p> : null}
          </div>
        ) : null}

        {!loading && visible.length === 0 ? (
          <p className="rounded-2xl border border-ink-100 bg-white p-5 text-sm text-ink-600 shadow-soft">
            {substack.emptyState}
          </p>
        ) : null}

      </div>
    </section>
  );
}

/** @deprecated Use SubstackWriting */
export const Insights = SubstackWriting;
