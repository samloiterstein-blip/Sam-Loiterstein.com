import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { resume, site, type CredentialEntry, type TimelineEntry } from "@/data/content";

export function Resume() {
  return (
    <Section
      id="resume"
      eyebrow={resume.eyebrow}
      title={resume.title}
      description={resume.description}
    >
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <Button as="a" href={site.resumeUrl} download size="md">
          <Download size={16} />
          {resume.pdfButtonLabel}
        </Button>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16">
        <Timeline title="Experience" items={resume.experience} />
        <Timeline title="Education" items={resume.education} />
      </div>

      <div className="mt-14">
        <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
          {resume.credentialsTitle}
        </h3>
        <Credentials items={resume.credentials} />
      </div>
    </Section>
  );
}

function Timeline({ title, items }: { title: string; items: readonly TimelineEntry[] }) {
  return (
    <div>
      <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
        {title}
      </h3>
      <ol className="relative border-l border-ink-100 pl-8">
        {items.map((item, i) => (
          <motion.li
            key={item.title + item.period + item.org}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="relative pb-10 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[33px] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-sage-400 bg-cream"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-sage-600" />
            </span>

            <div className="text-xs uppercase tracking-[0.16em] text-ink-500">
              {item.period}
            </div>
            <div className="mt-2 flex items-start gap-3">
              <OrgLogo
                src={item.logoSrc}
                label={item.logoLabel ?? initialsFromOrg(item.org)}
                org={item.org}
              />
              <div>
                <div className="font-display text-xl text-ink-900 sm:text-2xl">
                  {item.title}
                </div>
                <div className="mt-0.5 text-sm text-sage-800">
                  {item.org}
                  {item.location ? <span className="text-ink-400">, {item.location}</span> : null}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">{item.description}</p>
            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
                {item.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span aria-hidden className="mt-2 block h-1 w-1 rounded-full bg-sage-500" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function OrgLogo({ src, label, org }: { src?: string; label: string; org: string }) {
  return (
    <span
      className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-200 bg-white text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-700 shadow-soft"
    >
      {src ? (
        <img
          src={src}
          alt={`${org} logo`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
      ) : (
        label
      )}
    </span>
  );
}

function Credentials({ items }: { items: readonly CredentialEntry[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.article
          key={item.title + item.issuer}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft"
        >
          <div className="flex items-start gap-3">
            <OrgLogo
              src={item.logoSrc}
              label={item.logoLabel ?? initialsFromOrg(item.issuer)}
              org={item.issuer}
            />
            <div className="min-w-0">
              <div className="font-display text-lg leading-tight text-ink-900">{item.title}</div>
              <div className="mt-1 text-sm text-sage-800">{item.issuer}</div>
              {item.credentialId ? (
                <div className="mt-1 text-xs text-ink-500">Credential ID {item.credentialId}</div>
              ) : null}
              {item.credentialUrl ? (
                <a
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-sage-700 underline-offset-4 hover:underline"
                >
                  Show credential
                </a>
              ) : null}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function initialsFromOrg(org: string) {
  return org
    .split(" ")
    .map((w) => w.replace(/[^A-Za-z]/g, ""))
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
