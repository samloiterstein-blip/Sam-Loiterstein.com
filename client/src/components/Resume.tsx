import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { resume, site, type CredentialEntry, type TimelineEntry } from "@/data/content";

const YEAR_HEIGHT = 100;
const AXIS_WIDTH = 40;
const SLOT_WIDTH = 36;   // one dedicated horizontal slot per bar — wide enough for logo
const BAR_WIDTH = 4;
const LOGO_SIZE = 28;
const MIN_BAR_HEIGHT = 48;
const BAR_OPACITY = 0.55;

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

      <UnifiedTimeline experience={resume.experience} education={resume.education} />

      <div className="mt-14">
        <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
          {resume.credentialsTitle}
        </h3>
        <Credentials items={resume.credentials} />
      </div>
    </Section>
  );
}

type PositionedEntry = TimelineEntry & { resolvedEnd: number };

function UnifiedTimeline({
  experience,
  education,
}: {
  experience: readonly TimelineEntry[];
  education: readonly TimelineEntry[];
}) {
  const allItems = [...experience, ...education];
  const minYear = Math.min(...allItems.map((i) => i.startYear));
  const maxYear = Math.max(...allItems.map((i) => resolveEndYear(i.endYear)));
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const timelineHeight = years.length * YEAR_HEIGHT;

  const workSorted = resolveAndSort(experience);
  const eduSorted = resolveAndSort(education);

  const workBarCol = workSorted.length * SLOT_WIDTH;
  const eduBarCol = eduSorted.length * SLOT_WIDTH;
  const gridCols = `minmax(0,1fr) ${workBarCol}px ${AXIS_WIDTH}px ${eduBarCol}px minmax(0,1fr)`;

  return (
    <div>
      <div
        className="mb-5 hidden md:grid"
        style={{ gridTemplateColumns: gridCols, columnGap: 8 }}
      >
        <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">Experience</h3>
        <div
          className="col-span-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-ink-400"
        >
          Timeline
        </div>
        <h3 className="text-right text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
          Education
        </h3>
      </div>

      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: gridCols, columnGap: 8, minHeight: timelineHeight + 40 }}
      >
        {/* ── Experience cards — same order as bars (newest first = slot 0) ── */}
        <div className="flex flex-col gap-2 self-start pr-1">
          {workSorted.map((item, i) => (
            <EntryCard key={entryKey(item)} item={item} align="left" index={i} slotIndex={i} totalSlots={workSorted.length} />
          ))}
        </div>

        {/* ── Work bars ── */}
        <div className="relative" style={{ width: workBarCol }}>
          {workSorted.map((item, i) => (
            <TimelineBar key={entryKey(item)} item={item} side="left" maxYear={maxYear} slotIndex={i} totalSlots={workSorted.length} />
          ))}
        </div>

        {/* ── Year axis ── */}
        <div className="relative" style={{ width: AXIS_WIDTH }}>
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-ink-200" />
          {years.map((year) => (
            <div
              key={year}
              className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium tabular-nums text-ink-400"
              style={{ top: yearToTop(year, maxYear) + YEAR_HEIGHT / 2 - 8 }}
            >
              {year}
            </div>
          ))}
        </div>

        {/* ── Edu bars ── */}
        <div className="relative" style={{ width: eduBarCol }}>
          {eduSorted.map((item, i) => (
            <TimelineBar key={entryKey(item)} item={item} side="right" maxYear={maxYear} slotIndex={i} totalSlots={eduSorted.length} />
          ))}
        </div>

        {/* ── Education cards — same order as bars ── */}
        <div className="flex flex-col gap-2 self-start pl-1">
          {eduSorted.map((item, i) => (
            <EntryCard key={entryKey(item)} item={item} align="right" index={i} slotIndex={i} totalSlots={eduSorted.length} />
          ))}
        </div>
      </div>

      {/* Mobile fallback */}
      <div className="grid gap-12 md:hidden">
        <MobileTimeline title="Experience" items={experience} />
        <MobileTimeline title="Education" items={education} />
      </div>
    </div>
  );
}

function EntryCard({
  item,
  align,
  index,
  slotIndex,
  totalSlots,
}: {
  item: PositionedEntry;
  align: "left" | "right";
  index: number;
  slotIndex: number;
  totalSlots: number;
}) {
  const isLeft = align === "left";
  // Subtle left-border accent sized to indicate slot position relative to axis
  const borderColor = item.barColor;
  void slotIndex; void totalSlots; // reserved for future connector lines

  return (
    <motion.article
      initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-soft"
      style={
        isLeft
          ? { borderLeftWidth: 3, borderLeftColor: borderColor }
          : { borderRightWidth: 3, borderRightColor: borderColor }
      }
    >
      <div className={`flex items-start gap-3 p-3 ${isLeft ? "" : "flex-row-reverse"}`}>
        <OrgLogo
          src={item.logoSrc}
          label={item.logoLabel ?? initialsFromOrg(item.org)}
          org={item.org}
          background={item.logoBackground}
          size={34}
        />
        <div className={`min-w-0 ${isLeft ? "" : "text-right"}`}>
          <div className="text-[10px] uppercase tracking-[0.14em] text-ink-500">{item.period}</div>
          <div className="mt-0.5 font-display text-sm leading-snug text-ink-900">{item.title}</div>
          <div className="mt-0.5 text-xs leading-snug text-sage-800">{item.org}</div>
        </div>
      </div>
    </motion.article>
  );
}

function TimelineBar({
  item,
  side,
  maxYear,
  slotIndex,
  totalSlots,
}: {
  item: PositionedEntry;
  side: "left" | "right";
  maxYear: number;
  slotIndex: number;
  totalSlots: number;
}) {
  const top = barTop(item.resolvedEnd, maxYear);
  const height = barHeight(item.startYear, item.resolvedEnd, maxYear);
  const innerEdge = side === "left" ? "right" : "left";

  // Each slot is SLOT_WIDTH wide; center bar and logo within it
  const slotCenter = slotIndex * SLOT_WIDTH + SLOT_WIDTH / 2;
  const barOffset = slotCenter - BAR_WIDTH / 2;
  const logoOffset = slotCenter - LOGO_SIZE / 2;
  void totalSlots;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.5 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: slotIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 origin-top"
      style={{ top, height }}
    >
      <div
        aria-hidden
        className="absolute top-0 rounded-full"
        style={{
          [innerEdge]: barOffset,
          width: BAR_WIDTH,
          height: "100%",
          backgroundColor: item.barColor,
          opacity: BAR_OPACITY,
        }}
      />
      <div
        className="absolute bottom-0 z-10"
        style={{ [innerEdge]: logoOffset, width: LOGO_SIZE, height: LOGO_SIZE }}
      >
        <OrgLogo
          src={item.logoSrc}
          label={item.logoLabel ?? initialsFromOrg(item.org)}
          org={item.org}
          background={item.logoBackground}
          size={LOGO_SIZE}
        />
      </div>
    </motion.div>
  );
}

function MobileTimeline({ title, items }: { title: string; items: readonly TimelineEntry[] }) {
  return (
    <div>
      <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-ink-500">{title}</h3>
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

            <div className="text-xs uppercase tracking-[0.16em] text-ink-500">{item.period}</div>
            <div className="mt-2 flex items-start gap-3">
              <OrgLogo
                src={item.logoSrc}
                label={item.logoLabel ?? initialsFromOrg(item.org)}
                org={item.org}
                background={item.logoBackground}
                size={40}
              />
              <div>
                <div className="font-display text-xl text-ink-900 sm:text-2xl">{item.title}</div>
                <div className="mt-0.5 text-sm text-sage-800">
                  {item.org}
                  {item.location ? <span className="text-ink-400">, {item.location}</span> : null}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">{item.description}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function resolveEndYear(endYear: number | "present"): number {
  return endYear === "present" ? new Date().getFullYear() : endYear;
}

function yearToTop(year: number, maxYear: number): number {
  return (maxYear - year) * YEAR_HEIGHT;
}

function barTop(endYear: number, maxYear: number): number {
  return yearToTop(endYear, maxYear);
}

function barHeight(startYear: number, endYear: number, maxYear: number): number {
  const top = barTop(endYear, maxYear);
  const bottom = yearToTop(startYear, maxYear) + YEAR_HEIGHT;
  return Math.max(bottom - top, MIN_BAR_HEIGHT);
}

function entryKey(item: Pick<TimelineEntry, "org" | "startYear">) {
  return `${item.org}-${item.startYear}`;
}

function resolveAndSort(items: readonly TimelineEntry[]): PositionedEntry[] {
  return [...items]
    .map((item) => ({ ...item, resolvedEnd: resolveEndYear(item.endYear) }))
    .sort((a, b) => b.startYear - a.startYear || b.resolvedEnd - a.resolvedEnd);
}

function OrgLogo({
  src,
  label,
  org,
  background,
  size = 40,
}: {
  src?: string;
  label: string;
  org: string;
  background?: string;
  size?: number;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-200 text-[9px] font-semibold uppercase tracking-[0.06em] text-ink-700 shadow-soft"
      style={{ width: size, height: size, backgroundColor: background ?? "#ffffff" }}
    >
      {src ? (
        <img src={src} alt={`${org} logo`} loading="lazy" decoding="async" className="h-full w-full object-contain" />
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
