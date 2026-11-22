export const CONTACT_INTENT_EVENT = "contact-intent";

export function readContactIntent(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("intent") ?? "";
}

export function openContact(intent?: string) {
  const url = new URL(window.location.href);
  if (intent) url.searchParams.set("intent", intent);
  url.hash = "contact";
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.pushState({}, "", next);
  window.dispatchEvent(new CustomEvent(CONTACT_INTENT_EVENT, { detail: intent ?? "" }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function contactHref(intent?: string): string {
  if (!intent) return "#contact";
  return `/?intent=${encodeURIComponent(intent)}#contact`;
}
