import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { media, site, substack, writingSection, type MediaItem } from "@/data/content";
import { CubeTurn } from "./RotatingWork";

export type SubstackPost = {
  title: string;
  link: string;
  publishedAt: string;
  excerpt: string;
  image?: string;
};

type FeedPayload = {
  publicationHost: string;
  publicationUrl: string;
  fetchedAt: string;
  posts: SubstackPost[];
  nextCursor?: string | null;
};

function sortNewest(posts: SubstackPost[]): SubstackPost[] {
  return [...posts].sort((a, b) => noteTime(b.publishedAt) - noteTime(a.publishedAt));
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

function formatWhen(time: number, raw?: string): string {
  if (raw && /^\d{4}$/.test(raw.trim())) return raw.trim();
  if (!time) return raw?.trim() || "";
  return new Date(time).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function coverageAction(type: MediaItem["type"]): string {
  if (type === "Podcast") return "Listen";
  if (type === "Mention") return "View mention";
  if (type === "Article") return "Read the article";
  return "Read";
}

function sortedCoverage(): MediaItem[] {
  return [...media]
    .filter((item) => item.type !== "Podcast")
    .sort((a, b) => pressTime(b.date) - pressTime(a.date) || a.title.localeCompare(b.title));
}

function latestAudio(): MediaItem | undefined {
  return [...media]
    .filter((item) => item.type === "Podcast")
    .sort((a, b) => pressTime(b.date) - pressTime(a.date))[0];
}

const ROTATION_LIMIT = 12;

function nextFree(current: number, blocked: readonly number[], length: number) {
  if (length <= 1) return current;
  const taken = new Set(blocked);
  for (let step = 1; step < length; step += 1) {
    const next = (current + step) % length;
    if (!taken.has(next)) return next;
  }
  return current;
}

function itemKey(item: MediaItem) {
  return `${item.type}|${item.outlet}|${item.title}`;
}

function buildPressPool(): { items: MediaItem[]; slots: number } {
  const coverage = sortedCoverage();
  const audio = latestAudio();
  const lead = [coverage[0], coverage[1], audio].filter((item): item is MediaItem => Boolean(item));
  const keys = new Set(lead.map(itemKey));
  const rest = [...media]
    .filter((item) => !keys.has(itemKey(item)))
    .sort((a, b) => pressTime(b.date) - pressTime(a.date) || a.title.localeCompare(b.title));
  return { items: [...lead, ...rest], slots: lead.length };
}

async function loadStaticPage(cursor: string | null, limit: number = substack.pageSize): Promise<FeedPayload | null> {
  const offsetMatch = cursor?.match(/^offset:(\d+)$/);
  const start = offsetMatch ? Number(offsetMatch[1]) : 0;
  const staticRes = await fetch(substack.feedPath, { cache: "no-store" });
  if (!staticRes.ok) return null;
  const data = (await staticRes.json()) as FeedPayload;
  const sorted = sortNewest(data.posts ?? []);
  const posts = sorted.slice(start, start + limit);
  const next = start + posts.length;
  return {
    ...data,
    posts,
    nextCursor: next < sorted.length ? `offset:${next}` : null,
  };
}

async function loadSubstackPage(cursor: string | null, limit: number = substack.pageSize): Promise<FeedPayload | null> {
  if (!cursor?.startsWith("offset:")) {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
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
    return await loadStaticPage(cursor, limit);
  } catch {
    return null;
  }
}

function Cover({ src, fill = false }: { src?: string; fill?: boolean }) {
  const [failed, setFailed] = useState(false);
  const frame = fill ? "absolute inset-0 h-full w-full" : "h-full min-h-52 w-full";
  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-sage-100 ${frame}`} aria-hidden>
        <svg viewBox="0 0 160 160" className="h-28 w-28 text-sage-300">
          <circle cx="80" cy="80" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="64" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className={`${frame} object-cover`}
      onError={() => setFailed(true)}
    />
  );
}

function ReadLink({ label }: { label: string }) {
  return (
    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-sage-800">
      {label}
      <ArrowUpRight
        size={14}
        className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
    </span>
  );
}

function FeaturedWriting({ post }: { post: SubstackPost }) {
  const when = formatWhen(noteTime(post.publishedAt));
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics="press:post"
      className="group grid overflow-hidden rounded-2xl border border-ink-100 bg-white sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
    >
      <div className="relative min-h-52 min-w-0 overflow-hidden bg-sage-100 sm:h-full">
        <Cover src={post.image} fill />
      </div>
      <div className="flex min-w-0 flex-col p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">
          Substack{when ? ` · ${when}` : ""}
        </p>
        <h3 className="mt-3 line-clamp-2 font-display text-xl leading-snug text-ink-900">{post.title}</h3>
        {post.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{post.excerpt}</p> : null}
        <ReadLink label="Read" />
      </div>
    </a>
  );
}

function WritingCard({ post, inert = false }: { post: SubstackPost; inert?: boolean }) {
  const when = formatWhen(noteTime(post.publishedAt));
  const body = (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">
        Substack{when ? ` · ${when}` : ""}
      </p>
      <h3 className="mt-3 line-clamp-2 font-display text-xl leading-snug text-ink-900">{post.title}</h3>
      {post.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{post.excerpt}</p> : null}
      <ReadLink label="Read" />
    </>
  );
  const className = "group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5";
  if (inert) return <div className={className}>{body}</div>;
  return (
    <a href={post.link} target="_blank" rel="noopener noreferrer" data-analytics="press:post" className={className}>
      {body}
    </a>
  );
}

function PressCard({ item, featured = false, inert = false }: { item: MediaItem; featured?: boolean; inert?: boolean }) {
  const when = formatWhen(pressTime(item.date), item.date);
  const meta = [item.type, item.outlet, when].filter(Boolean).join(" · ");
  const body = (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-sage-800">{meta}</p>
      <h3 className={`mt-3 line-clamp-2 font-display leading-snug text-ink-900 ${featured ? "text-2xl" : "text-xl"}`}>
        {item.title}
      </h3>
      <ReadLink label={coverageAction(item.type)} />
    </>
  );
  const className = featured
    ? "group flex h-full min-h-40 flex-col rounded-2xl border border-sage-200 bg-sage-50 p-5"
    : "group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5";
  if (inert || !item.href) return <div className={className}>{body}</div>;
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" data-analytics="press:coverage" className={className}>
      {body}
    </a>
  );
}

function AudioCard({ item, inert = false }: { item: MediaItem; inert?: boolean }) {
  const when = formatWhen(pressTime(item.date), item.date);
  const body = (
    <>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-700 text-cream">
        <Play size={14} className="translate-x-px" aria-hidden />
      </span>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">
        {[item.type, item.outlet, when].filter(Boolean).join(" · ")}
      </p>
      <h3 className="mt-2 font-display text-xl leading-snug text-ink-900">{item.title}</h3>
      <ReadLink label="Listen" />
    </>
  );
  const className = "group flex h-full flex-col rounded-2xl border border-dashed border-sage-300 bg-white p-5";
  if (inert || !item.href) return <div className={className}>{body}</div>;
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" data-analytics="press:audio" className={className}>
      {body}
    </a>
  );
}

function PressArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const next = direction === "next";
  const Icon = next ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      aria-label={next ? "Next coverage" : "Previous coverage"}
      data-analytics={next ? "press:next" : "press:previous"}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-100 bg-white text-ink-900 shadow-sm transition hover:bg-sage-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 disabled:opacity-60"
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}

function pressFace(item: MediaItem, featured = false, inert = false) {
  if (!featured && item.type === "Podcast") return <AudioCard item={item} inert={inert} />;
  return <PressCard item={item} featured={featured} inert={inert} />;
}

function RotatingBlock({
  from,
  turning,
  onTurnEnd,
  renderFront,
  renderSide,
  wide = false,
}: {
  from: "left" | "right";
  turning: boolean;
  onTurnEnd: () => void;
  renderFront: (inert: boolean) => ReactNode;
  renderSide: (inert: boolean) => ReactNode;
  wide?: boolean;
}) {
  return (
    <CubeTurn
      from={from}
      turning={turning}
      onTurnEnd={onTurnEnd}
      className={wide ? "relative w-full" : "relative h-full w-full"}
      faceClassName="work-face-card"
      front={renderFront(false)}
      side={renderSide(true)}
      sizer={
        <>
          <div className="col-start-1 row-start-1">{renderFront(true)}</div>
          <div className="col-start-1 row-start-1">{renderSide(true)}</div>
        </>
      }
    />
  );
}

export function SubstackWriting() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const publicationUrl = substack.publicationUrl;

  const loadLatest = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const page = await loadSubstackPage(null, ROTATION_LIMIT);
      setPosts(page ? sortNewest(page.posts) : []);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLatest();
  }, [loadLatest]);

  const featuredPost = posts[0];
  const writingPool = posts.slice(1);
  const pressDeck = useMemo(() => buildPressPool(), []);
  const [writingSlots, setWritingSlots] = useState([0, 1]);
  const [pressOffset, setPressOffset] = useState(0);
  const [pressFrom, setPressFrom] = useState<"left" | "right">("right");
  const [pressTurning, setPressTurning] = useState(false);
  const [activeTurn, setActiveTurn] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<number | null>(null);
  const endRef = useRef<(() => void) | null>(null);
  const pressDelta = useRef(1);
  const pressFinished = useRef(false);

  useEffect(() => {
    if (loading) return;
    const writing = posts.slice(1);
    const turns: { id: string; slot: number; hold: number }[] = [];
    if (writing.length > 2) {
      turns.push({ id: "w0", slot: 0, hold: 5400 });
      turns.push({ id: "w1", slot: 1, hold: 7600 });
    }
    if (!turns.length) return;

    let alive = true;
    const timers = new Set<number>();
    const shown = [0, 1];
    setWritingSlots([0, 1]);
    setActiveTurn(null);
    setIncoming(null);

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const waitForTurn = () =>
      new Promise<void>((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(backup);
          timers.delete(backup);
          endRef.current = null;
          resolve();
        };
        endRef.current = finish;
        const backup = window.setTimeout(finish, 2700);
        timers.add(backup);
      });

    const run = async () => {
      await wait(4200);
      let step = 0;
      while (alive) {
        const turn = turns[step % turns.length];
        step += 1;
        const dest = nextFree(shown[turn.slot] ?? 0, shown, writing.length);
        if (dest !== shown[turn.slot]) {
          setIncoming(dest);
          setActiveTurn(turn.id);
          await waitForTurn();
          if (!alive) return;
          shown[turn.slot] = dest;
          setWritingSlots([shown[0], shown[1]]);
          setActiveTurn(null);
          setIncoming(null);
        }
        await wait(turn.hold);
      }
    };

    void run();
    return () => {
      alive = false;
      endRef.current = null;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [loading, posts]);

  const finishTurn = () => endRef.current?.();
  const writingIndex = (slot: number, length: number) => {
    const current = writingSlots[slot] ?? slot;
    const turning = activeTurn === `w${slot}`;
    if (turning && incoming !== null) return incoming;
    return nextFree(current, writingSlots, length);
  };
  const writingAt = (slot: number) => writingPool[writingSlots[slot] ?? slot];
  const writingNextAt = (slot: number) => writingPool[writingIndex(slot, writingPool.length)];
  const pressLength = pressDeck.items.length;
  const pressShift = pressFrom === "left" ? -1 : 1;
  const pressAt = (slot: number, extra = 0) => {
    if (slot >= Math.min(3, pressLength)) return undefined;
    return pressDeck.items[((pressOffset + slot + extra) % pressLength + pressLength) % pressLength];
  };
  const finishPressTurn = () => {
    if (pressFinished.current) return;
    pressFinished.current = true;
    setPressOffset((current) => {
      const len = pressDeck.items.length;
      return (current + pressDelta.current + len) % len;
    });
    setPressTurning(false);
  };
  const stepPress = (delta: 1 | -1) => {
    if (pressTurning || pressLength < 2) return;
    pressFinished.current = false;
    pressDelta.current = delta;
    setPressFrom(delta === 1 ? "right" : "left");
    setPressTurning(true);
  };

  const schema = useMemo(() => {
    if (!posts.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: substack.title,
      description: substack.description,
      url: publicationUrl,
      author: {
        "@type": "Person",
        name: site.name,
        url: "https://sam-loiterstein.com",
        sameAs: [substack.profileUrl, publicationUrl],
      },
      publisher: {
        "@type": "Person",
        name: site.name,
      },
      blogPost: posts.slice(0, 12).map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: post.link,
        datePublished: post.publishedAt,
        description: post.excerpt,
        ...(post.image ? { image: post.image } : {}),
        author: { "@type": "Person", name: site.name },
        mainEntityOfPage: post.link,
        isPartOf: { "@type": "Blog", url: publicationUrl },
      })),
    };
  }, [posts, publicationUrl]);

  return (
    <section id="press" aria-labelledby="press-title" className="relative scroll-mt-24 pt-12 pb-4 sm:pt-14 sm:pb-6 lg:pt-8 lg:pb-2">
      <div className="container-page">
        {schema ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ) : null}

        <div className="h-px bg-sage-300/80" />
        <header className="mb-8 sm:mb-10">
          <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-sage-800 sm:mt-10 sm:text-xs">
            {writingSection.eyebrow}
          </p>
          <h2
            id="press-title"
            className="mt-3 text-center font-display text-4xl font-medium tracking-tightish text-ink-900 sm:text-5xl lg:text-6xl"
          >
            {writingSection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-ink-600 sm:text-lg">
            {writingSection.description}
          </p>
        </header>

        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-sage-800">In my words</p>
                <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">Writing</h3>
              </div>
              <a
                href={publicationUrl}
                target="_blank"
                rel="noopener noreferrer author"
                data-analytics="press:all-writing"
                className="inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
              >
                All writing
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </div>

            {loading ? <p className="text-sm text-ink-500">Loading recent posts.</p> : null}

            {!loading && featuredPost ? <FeaturedWriting post={featuredPost} /> : null}

            {!loading && writingAt(0) ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {([0, 1] as const).map((slot) => {
                  const post = writingAt(slot);
                  const next = writingNextAt(slot);
                  if (!post || !next) return null;
                  return (
                    <RotatingBlock
                      key={`w${slot}`}
                      from={slot === 0 ? "left" : "right"}
                      turning={activeTurn === `w${slot}`}
                      onTurnEnd={finishTurn}
                      renderFront={(inert) => <WritingCard post={post} inert={inert} />}
                      renderSide={(inert) => <WritingCard post={next} inert={inert} />}
                    />
                  );
                })}
              </div>
            ) : null}

            {!loading && !featuredPost ? (
              <p className="rounded-2xl border border-ink-100 bg-white p-5 text-sm text-ink-600">{substack.emptyState}</p>
            ) : null}
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-sage-800">In the world</p>
                <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
                  Press & audio
                </h3>
              </div>
              {pressLength > 1 ? (
                <div className="flex gap-2 sm:hidden">
                  <PressArrow direction="previous" disabled={pressTurning} onClick={() => stepPress(-1)} />
                  <PressArrow direction="next" disabled={pressTurning} onClick={() => stepPress(1)} />
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
            {pressLength > 1 ? (
              <div className="hidden sm:block">
                <PressArrow direction="previous" disabled={pressTurning} onClick={() => stepPress(-1)} />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">

            {pressAt(0) ? (
              <RotatingBlock
                from={pressFrom}
                turning={pressTurning}
                onTurnEnd={finishPressTurn}
                wide
                renderFront={(inert) => pressFace(pressAt(0) as MediaItem, true, inert)}
                renderSide={(inert) => pressFace(pressAt(0, pressShift) as MediaItem, true, inert)}
              />
            ) : null}

            {pressAt(1) || pressAt(2) ? (
              <div className={`mt-3 grid gap-3 ${pressAt(1) && pressAt(2) ? "sm:grid-cols-2" : ""}`}>
                {([1, 2] as const).map((slot) => {
                  const item = pressAt(slot);
                  const next = pressAt(slot, pressShift);
                  if (!item || !next) return null;
                  return (
                    <RotatingBlock
                      key={`p${slot}`}
                      from={pressFrom}
                      turning={pressTurning}
                      onTurnEnd={finishPressTurn}
                      renderFront={(inert) => pressFace(item, false, inert)}
                      renderSide={(inert) => pressFace(next, false, inert)}
                    />
                  );
                })}
              </div>
            ) : null}
            </div>
            {pressLength > 1 ? (
              <div className="hidden sm:block">
                <PressArrow direction="next" disabled={pressTurning} onClick={() => stepPress(1)} />
              </div>
            ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm">
          <a
            href={publicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="press:subscribe"
            className="inline-flex items-center gap-1.5 font-medium text-sage-800 hover:text-sage-900"
          >
            {substack.subscribeLabel}
            <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use SubstackWriting */
export const Insights = SubstackWriting;
