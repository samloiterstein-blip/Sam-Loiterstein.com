export type AnalyticsEventType =
  | "pageview"
  | "section_view"
  | "scroll_depth"
  | "click";

export type CollectSession = {
  id: string;
  visitorId: string;
  startedAt: string;
  referrer: string | null;
  landingPath: string;
  uaDevice: string | null;
  uaBrowser: string | null;
  screenW: number | null;
  hasReplay: boolean;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  sourceSlug?: string | null;
};

export type CollectEvent = {
  type: AnalyticsEventType;
  ts?: string;
  path?: string;
  props?: Record<string, unknown>;
};

export type CollectClick = {
  ts?: string;
  path?: string;
  target?: string | null;
  xPct: number;
  yPct: number;
  vw?: number | null;
  vh?: number | null;
};

export type CollectPayload = {
  session: CollectSession;
  events?: CollectEvent[];
  clicks?: CollectClick[];
  endedAt?: string | null;
};

export type ReplayPayload = {
  sessionId: string;
  seq: number;
  events: unknown[];
};
