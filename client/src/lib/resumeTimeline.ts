import type { TimelineEntry } from "@/data/content";

export const TIMELINE_MIN = 2019;
export const TIMELINE_MAX = 2027;
export const TIMELINE_PRESENT_YEAR = 2026;

const SPAN = TIMELINE_MAX - TIMELINE_MIN;

export function resolveEndYear(entry: TimelineEntry): number {
  if (entry.endYear === "present") return TIMELINE_PRESENT_YEAR;
  return entry.endYear;
}

/** 0–100 position for the start of a calendar year on the shared scale. */
export function yearStartPercent(year: number): number {
  return ((year - TIMELINE_MIN) / SPAN) * 100;
}

/** 0–100 position for the end of a calendar year (inclusive). */
export function yearEndPercent(year: number): number {
  return ((year - TIMELINE_MIN + 1) / SPAN) * 100;
}

export function barMetrics(entry: TimelineEntry) {
  const end = resolveEndYear(entry);
  const left = yearStartPercent(entry.startYear);
  const right = yearEndPercent(end);
  return {
    left,
    width: Math.max(right - left, 100 / SPAN / 2),
  };
}

export function barFill(color: string, opacity = 0.32): string {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const TIMELINE_YEARS = Array.from(
  { length: TIMELINE_MAX - TIMELINE_MIN + 1 },
  (_, i) => TIMELINE_MIN + i
);
