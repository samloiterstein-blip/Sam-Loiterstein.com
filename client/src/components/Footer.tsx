import { ArrowUp } from "lucide-react";
import { footer, site } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-cream py-12">
      <div className="container-page flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-lg text-ink-900">{site.name}</div>
          <p className="mt-1 text-sm text-ink-500">
            © {new Date().getFullYear()} {site.name}, {site.location}.
          </p>
          <p className="mt-3 text-sm text-ink-600">
            <span className="text-ink-500">{footer.fanLabel}</span>{" "}
            {footer.fanLinks.map((link, i) => (
              <span key={link.href}>
                {i > 0 ? " · " : null}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm text-ink-600">
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="link-underline"
          >
            LinkedIn
          </a>
          <a href={site.socials.email} className="link-underline">
            Email
          </a>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-2 grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-700 transition hover:border-sage-400 hover:text-sage-800"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
