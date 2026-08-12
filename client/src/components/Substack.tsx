import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { site, substack } from "@/data/content";

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
};

function formatPostDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function publicationUrl(): string {
  return substack.profileUrl;
}

function embedUrl(): string {
  const host = substack.publicationHost.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}/embed`;
}

export function SubstackWriting() {
  const [feed, setFeed] = useState<FeedPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const pubUrl = publicationUrl();
  const embedSrc = embedUrl();
  const canonicalPubUrl = `https://${substack.publicationHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const staticRes = await fetch(substack.feedPath);
        if (staticRes.ok) {
          const data = (await staticRes.json()) as FeedPayload;
          if (!cancelled && data.posts?.length) {
            setFeed(data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall through to API
      }

      try {
        const apiRes = await fetch(substack.apiPath);
        if (apiRes.ok) {
          const data = (await apiRes.json()) as FeedPayload & { ok?: boolean };
          if (!cancelled && data.posts) {
            setFeed({
              publicationHost: data.publicationHost,
              publicationUrl: data.publicationUrl,
              fetchedAt: data.fetchedAt,
              posts: data.posts,
            });
          }
        }
      } catch {
        if (!cancelled) setFeed(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const schema = useMemo(() => {
    if (!feed?.posts.length) return null;
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
      blogPost: feed.posts.map((post) => ({
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
  }, [feed, pubUrl, canonicalPubUrl]);

  return (
    <section id="writing" className="py-12 sm:py-14 lg:py-16">
      <div className="container-page">
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}

        <div className="mb-8 max-w-3xl">
          <span className="eyebrow">{substack.eyebrow}</span>
          <h2 className="heading mt-5">{substack.title}</h2>
          <p className="subheading">{substack.description}</p>
          <a
            href={pubUrl}
            target="_blank"
            rel="noopener noreferrer author"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sage-800 hover:text-sage-900"
          >
            {substack.readLabel}
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {loading && (
              <p className="text-sm text-ink-500">Loading recent posts.</p>
            )}

            {!loading && feed && feed.posts.length > 0 && (
              <ol className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
                {feed.posts.map((post, i) => (
                  <motion.li
                    key={post.link}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                  >
                    <article className="group p-6 transition hover:bg-sage-50/40">
                      <time
                        dateTime={post.publishedAt}
                        className="text-xs uppercase tracking-[0.14em] text-ink-400"
                      >
                        {formatPostDate(post.publishedAt)}
                      </time>
                      <h3 className="mt-2 font-display text-xl text-ink-900 sm:text-2xl">
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition hover:text-sage-800"
                        >
                          {post.title}
                        </a>
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>
                      )}
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm text-sage-800"
                      >
                        {substack.readLabel}
                        <ArrowUpRight
                          size={14}
                          className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    </article>
                  </motion.li>
                ))}
              </ol>
            )}

            {!loading && (!feed || feed.posts.length === 0) && (
              <p className="rounded-2xl border border-ink-100 bg-white p-6 text-sm text-ink-600 shadow-soft">
                {substack.emptyState}
              </p>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
              <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
                {substack.subscribeLabel}
              </h3>
              <iframe
                src={embedSrc}
                title={substack.subscribeLabel}
                width="100%"
                height="320"
                className="mt-4 min-h-[320px] w-full rounded-xl border border-ink-100 bg-white"
                frameBorder={0}
                scrolling="no"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use SubstackWriting */
export const Insights = SubstackWriting;
