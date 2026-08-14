import type { AnalyticsQueue } from "./queue";

const SECTION_IDS = [
  "top",
  "approach",
  "work",
  "writing",
  "media",
  "background",
  "engagements",
  "contact",
];

function currentPath(): string {
  return window.location.pathname + window.location.hash || "/";
}

function resolveClickTarget(el: Element | null): string | null {
  let node: Element | null = el;
  while (node && node !== document.body) {
    const analytics = node.getAttribute("data-analytics");
    if (analytics) return analytics.slice(0, 200);

    if (node instanceof HTMLAnchorElement && node.href) {
      const label =
        node.getAttribute("aria-label") ||
        node.textContent?.trim() ||
        node.getAttribute("href") ||
        "link";
      return `link:${label}`.slice(0, 200);
    }

    if (node instanceof HTMLButtonElement) {
      const label =
        node.getAttribute("aria-label") ||
        node.textContent?.trim() ||
        node.type ||
        "button";
      return `button:${label}`.slice(0, 200);
    }

    if (node.id) return `#${node.id}`.slice(0, 200);
    node = node.parentElement;
  }
  return null;
}

export function attachCollectors(queue: AnalyticsQueue): () => void {
  const seenSections = new Set<string>();
  let maxScroll = 0;
  let lastScrollSent = 0;

  queue.pushEvent({ type: "pageview", path: currentPath() });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.id;
        if (!id || seenSections.has(id)) continue;
        seenSections.add(id);
        queue.pushEvent({
          type: "section_view",
          props: { section: id },
        });
      }
    },
    { threshold: 0.35 }
  );

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    if (pct > maxScroll) maxScroll = pct;
    if (maxScroll - lastScrollSent >= 25 || maxScroll === 100) {
      lastScrollSent = maxScroll;
      queue.pushEvent({
        type: "scroll_depth",
        props: { depth: maxScroll },
      });
    }
  };

  const onClick = (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target : null;
    const label = resolveClickTarget(target);
    const doc = document.documentElement;
    const w = Math.max(doc.scrollWidth, window.innerWidth) || 1;
    const h = Math.max(doc.scrollHeight, window.innerHeight) || 1;
    const xPct = Math.min(100, Math.max(0, ((e.pageX || 0) / w) * 100));
    const yPct = Math.min(100, Math.max(0, ((e.pageY || 0) / h) * 100));

    queue.pushClick({
      target: label,
      xPct,
      yPct,
    });

    if (label) {
      queue.pushEvent({
        type: "click",
        props: { target: label },
      });
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", onClick, true);
  onScroll();

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("click", onClick, true);
    if (maxScroll > lastScrollSent) {
      queue.pushEvent({
        type: "scroll_depth",
        props: { depth: maxScroll },
      });
    }
  };
}
