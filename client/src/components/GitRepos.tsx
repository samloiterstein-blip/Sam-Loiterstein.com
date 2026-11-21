import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gitSection, site } from "@/data/content";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  updated_at: string;
  fork: boolean;
};

function formatUpdated(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function GitRepos() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${site.githubUser}/repos?sort=updated&per_page=100`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
        const data = (await res.json()) as Repo[];
        if (cancelled) return;
        setRepos(
          data
            .filter((repo) => !repo.fork)
            .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
        );
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-ink-900">{gitSection.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">{gitSection.description}</p>
        </div>
        <a
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          data-analytics="work:github-profile"
          className="inline-flex items-center gap-1 text-sm font-medium text-sage-800 hover:text-sage-900"
        >
          {gitSection.profileLabel}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>

      {repos === null && !failed ? (
        <p className="mt-6 text-sm text-ink-500">{gitSection.loading}</p>
      ) : null}

      {failed ? (
        <p className="mt-6 rounded-2xl border border-ink-100 bg-white p-5 text-sm text-ink-600">{gitSection.empty}</p>
      ) : null}

      {repos && repos.length > 0 ? (
        <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2">
          {repos.map((repo) => (
            <li key={repo.id}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                data-analytics={`work:github-${repo.name}`}
                className="group flex h-full flex-col rounded-2xl border border-ink-100/80 bg-white/80 p-5 shadow-[0_4px_24px_-8px_rgba(17,29,22,0.08)] transition hover:border-sage-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-display text-lg text-ink-900 group-hover:text-sage-800">{repo.name}</h4>
                  <ArrowUpRight
                    size={16}
                    className="mt-1 shrink-0 text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage-800"
                    aria-hidden
                  />
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                  {repo.description || "Public repository."}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-500">
                  {repo.language ? `${repo.language}. ` : null}
                  Updated {formatUpdated(repo.updated_at)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
