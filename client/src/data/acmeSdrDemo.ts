/** Synthetic demo data for Acme Corp SDR workspace — no real customer data. */

export type NavId =
  | "accounts"
  | "contacts"
  | "deals"
  | "sequences"
  | "revops"
  | "sdr-gpt"
  | "deal-signals"
  | "news"
  | "conferences"
  | "parking-lot"
  | "linkedin"
  | "integrations";

export const APP_NAME = "Acme SDR";
export const APP_SUBTITLE = "ACME CORP";

export const pipelines = [
  "Enterprise Sales Pipeline",
  "Partner Channel Pipeline",
  "Mid-Market Pipeline",
] as const;

export type Account = {
  id: string;
  name: string;
  domain: string;
  tier: "T1" | "T2" | "T3";
  industry: string;
  contacts: number;
  openDeals: number;
  lastActivity: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  owner: string;
  lastContact: string | null;
  tags: string[];
  dataQuality: ("missing_phone" | "stale" | "unverified")[];
};

export type Deal = {
  id: string;
  name: string;
  company: string;
  pipeline: string;
  stage: string;
  owner: string;
  type: string;
  amount: number | null;
  closeDate: string | null;
  forecast: string;
};

export type ActionHubItem = {
  id: string;
  deal: string;
  company: string;
  contact: string;
  contactEmail: string;
  ends: string;
  timingDays: number;
  lastContact: string | null;
  owner: string | null;
  kind: "trial" | "renewal";
  done?: boolean;
};

export type Sequence = {
  id: string;
  name: string;
  vertical: string;
  persona: string;
  source: "Apollo" | "CRM";
  status: "In flight" | "Not started";
  steps?: number;
  delivered?: number;
  openRate?: number;
  replyRate?: number;
  bounceRate?: number;
  unsubscribed?: number;
  sheetContacts?: number;
  crmEnrolled?: number;
};

export type Hypothesis = {
  id: string;
  title: string;
  status: "DRAFT" | "RESEARCHING" | "REVIEWING";
  description: string;
  accounts: [number, number];
  contacts: [number, number];
  created: string;
};

export type NewsSignal = {
  id: string;
  headline: string;
  snippet: string;
  source: string;
  company: string;
  date: string;
  category: "Advertising" | "Data / API" | "Integrated" | "Not Relevant";
  priority: "high" | "medium" | "low";
  score: number;
  status: "reviewed" | "new" | "in_progress" | "complete";
  vertical: string;
};

export type Conference = {
  id: string;
  name: string;
  dates: string;
  location: string;
  attendees: number;
  matched: number;
  attending: string[];
  crmList?: number;
};

export type ParkingIdea = {
  id: string;
  title: string;
  quadrant: "quick-win" | "high-potential" | "low-value" | "needs-thinking";
  dealType?: string;
  vertical?: string;
  blocker?: string;
  staleDays?: number;
  impact?: number;
  readiness?: number;
};

export type LinkedInTeammate = {
  id: string;
  name: string;
  connected: string;
  lastSync: string;
  connections: number;
  matched: number;
};

export const accounts: Account[] = [
  { id: "a1", name: "Nova Retail Group", domain: "novaretail.example", tier: "T1", industry: "Retail", contacts: 24, openDeals: 2, lastActivity: "Jun 12, 2026" },
  { id: "a2", name: "Summit Logistics", domain: "summitlog.example", tier: "T1", industry: "Transportation", contacts: 18, openDeals: 1, lastActivity: "Jun 10, 2026" },
  { id: "a3", name: "Harbor Media", domain: "harbormedia.example", tier: "T2", industry: "Media", contacts: 11, openDeals: 3, lastActivity: "Jun 8, 2026" },
  { id: "a4", name: "Brightline Health", domain: "brightline.example", tier: "T2", industry: "Healthcare", contacts: 9, openDeals: 0, lastActivity: "May 28, 2026" },
  { id: "a5", name: "Atlas FinTech", domain: "atlasft.example", tier: "T3", industry: "Financial Services", contacts: 6, openDeals: 1, lastActivity: "Jun 1, 2026" },
];

export const contacts: Contact[] = [
  { id: "c1", name: "Alex Chen", email: "alex.chen@novaretail.example", company: "Nova Retail Group", title: "VP Operations", owner: "Jordan Lee", lastContact: "Jun 12, 2026", tags: ["Champion"], dataQuality: [] },
  { id: "c2", name: "Morgan Blake", email: "m.blake@summitlog.example", company: "Summit Logistics", title: "Director of Planning", owner: "Jordan Lee", lastContact: "Jun 10, 2026", tags: [], dataQuality: ["missing_phone"] },
  { id: "c3", name: "Riley Park", email: "r.park@harbormedia.example", company: "Harbor Media", title: "Head of Partnerships", owner: "Sam Rivera", lastContact: null, tags: ["Tier 1"], dataQuality: ["stale", "unverified"] },
  { id: "c4", name: "Casey Nguyen", email: "c.nguyen@brightline.example", company: "Brightline Health", title: "RevOps Manager", owner: "Sam Rivera", lastContact: "May 28, 2026", tags: [], dataQuality: [] },
  { id: "c5", name: "Taylor Brooks", email: "t.brooks@atlasft.example", company: "Atlas FinTech", title: "Founder", owner: "Jordan Lee", lastContact: "Jun 1, 2026", tags: ["Founder"], dataQuality: ["missing_phone"] },
  { id: "c6", name: "Jamie Ortiz", email: "j.ortiz@novaretail.example", company: "Nova Retail Group", title: "Data Lead", owner: "Jordan Lee", lastContact: "Jun 5, 2026", tags: [], dataQuality: [] },
];

export const deals: Deal[] = [
  { id: "d1", name: "Nova Retail — Enterprise Platform", company: "Nova Retail Group", pipeline: "Enterprise Sales Pipeline", stage: "Proposal", owner: "Jordan Lee", type: "New Business", amount: 48000, closeDate: "Jul 18, 2026", forecast: "Qualified Opportunity" },
  { id: "d2", name: "Summit Logistics — Pilot", company: "Summit Logistics", pipeline: "Enterprise Sales Pipeline", stage: "Trial Started", owner: "Jordan Lee", type: "Trial", amount: null, closeDate: "Jun 20, 2026", forecast: "Discovery" },
  { id: "d3", name: "Harbor Media — API Bundle", company: "Harbor Media", pipeline: "Partner Channel Pipeline", stage: "Qualified", owner: "Sam Rivera", type: "Expansion", amount: 12000, closeDate: "Aug 4, 2026", forecast: "Qualified Opportunity" },
  { id: "d4", name: "Atlas FinTech — Starter", company: "Atlas FinTech", pipeline: "Mid-Market Pipeline", stage: "Closed Won", owner: "Jordan Lee", type: "New Business", amount: 8500, closeDate: "Mar 17, 2025", forecast: "Closed" },
  { id: "d5", name: "Brightline — Renewal", company: "Brightline Health", pipeline: "Enterprise Sales Pipeline", stage: "Negotiation", owner: "Sam Rivera", type: "Renewal", amount: 22000, closeDate: "Jun 30, 2026", forecast: "Commit" },
  { id: "d6", name: "Coastal Events — Integration", company: "Coastal Events Co", pipeline: "Partner Channel Pipeline", stage: "Discovery", owner: "Sam Rivera", type: "New Business", amount: 15000, closeDate: "Sep 12, 2026", forecast: "Discovery" },
];

export const actionHubTrials: ActionHubItem[] = [
  { id: "t1", deal: "Pilot workspace — trial", company: "Unknown", contact: "Dev Team", contactEmail: "devops@example-startup.io", ends: "Jun 14, 2026", timingDays: 0, lastContact: "Jun 1, 2026", owner: null, kind: "trial" },
  { id: "t2", deal: "Sandbox access — trial", company: "Unknown", contact: "Product Lead", contactEmail: "product@sampleco.example", ends: "Jun 15, 2026", timingDays: 1, lastContact: null, owner: null, kind: "trial" },
  { id: "t3", deal: "Evaluation — trial", company: "Unknown", contact: "Engineering", contactEmail: "eng@democorp.example", ends: "Jun 16, 2026", timingDays: 2, lastContact: "May 30, 2026", owner: null, kind: "trial" },
];

export const actionHubRenewals: ActionHubItem[] = [
  { id: "r1", deal: "Platform renewal — annual", company: "Pioneer Apps (startup)", contact: "Chris Morgan", contactEmail: "c.morgan@pioneerapps.example", ends: "Jun 20, 2026", timingDays: 5, lastContact: "Jun 8, 2026", owner: "Jordan Lee", kind: "renewal" },
  { id: "r2", deal: "Data package — renewal", company: "Vertex Analytics", contact: "Dana Wells", contactEmail: "d.wells@vertex.example", ends: "Jul 31, 2026", timingDays: 47, lastContact: "Jun 2, 2026", owner: "Sam Rivera", kind: "renewal" },
  { id: "r3", deal: "Team license — renewal", company: "Northwind Labs", contact: "Pat Kim", contactEmail: "p.kim@northwind.example", ends: "Aug 15, 2026", timingDays: 63, lastContact: "May 20, 2026", owner: null, kind: "renewal" },
];

export const sequenceStats = {
  totalEmails: 1842,
  totalReplies: 19,
  replyRate: 1.0,
  meetingsBooked: 22,
  ownedSequences: 3,
  activeEnrollments: 0,
  contactsEnrolled: 312,
  hubspotEmails: 890,
  apolloDelivered: 952,
  apolloOpens: 241,
  apolloReplies: 19,
  bounced: 41,
  unsubscribed: 2,
};

export const sequences: Sequence[] = [
  { id: "s1", name: "Transportation — Ops & Planning", vertical: "Cities & Tourism", persona: "Data / Ops", source: "Apollo", status: "In flight", steps: 4, delivered: 412, openRate: 28.4, replyRate: 2.1, bounceRate: 3.2, unsubscribed: 1 },
  { id: "s2", name: "Retail — Merchandising Leaders", vertical: "Retail", persona: "VP / Director", source: "CRM", status: "In flight", steps: 3, delivered: 278, openRate: 31.2, replyRate: 1.4, bounceRate: 2.8, unsubscribed: 0 },
  { id: "s3", name: "Healthcare — RevOps", vertical: "Healthcare", persona: "RevOps / Finance", source: "Apollo", status: "Not started", sheetContacts: 84, crmEnrolled: 62 },
];

export const revopsFunnel = {
  target: 125000,
  closedWon: 91000,
  forecast: 218000,
  quarter: "Q2 2026",
  dealsOpen: 186,
  totalPipeline: 1240000,
  weighted: 742000,
};

export const revopsDealsByCompany = [
  { company: "Nova Retail Group", deal: "Enterprise Platform", stage: "50% Proposal", owner: "Jordan Lee", forecast: "Qualified Opportunity", close: "2026-07-18", amount: 48000, weighted: 24000 },
  { company: "Summit Logistics", deal: "Pilot expansion", stage: "25% Qualified", owner: "Jordan Lee", forecast: "Discovery", close: "2026-08-02", amount: 30000, weighted: 7500 },
  { company: "Harbor Media", deal: "API bundle", stage: "25% Qualified", owner: "Sam Rivera", forecast: "Qualified Opportunity", close: "2026-08-04", amount: 12000, weighted: 3000 },
  { company: "Brightline Health", deal: "Annual renewal", stage: "75% Negotiation", owner: "Sam Rivera", forecast: "Commit", close: "2026-06-30", amount: 22000, weighted: 16500 },
];

export const revopsHygiene = {
  score: 84,
  clean: 142,
  total: 168,
  flagged: 26,
  wonMissingDates: 8,
  issues: [
    { id: "h1", deal: "Legacy integration — won", company: "Meridian Co", closed: "2026-03-12", missing: ["Contract start", "Contract end"] },
    { id: "h2", deal: "Starter package — won", company: "Lumen Apps", closed: "2026-04-02", missing: ["Contract end"] },
    { id: "h3", deal: "Partner rollout — won", company: "Skyline Partners", closed: "2026-05-18", missing: ["Contract start"] },
  ],
  chips: [
    { label: "All", count: 26 },
    { label: "Stale activity", count: 9 },
    { label: "No associated company", count: 4 },
    { label: "Missing deal type", count: 6 },
    { label: "Missing amount", count: 3 },
    { label: "Missing close date", count: 4 },
  ],
};

export const hypotheses: Hypothesis[] = [
  { id: "hyp1", title: "Conference: Industry Summit '26", status: "RESEARCHING", description: "Attendee list cross-referenced against CRM — targeting ops leaders in retail.", accounts: [0, 3], contacts: [0, 12], created: "May 18, 2026" },
  { id: "hyp2", title: "Vertical: Regional logistics operators", status: "DRAFT", description: "Apollo search for mid-market planning teams with recent hiring signals.", accounts: [0, 0], contacts: [0, 0], created: "Jun 2, 2026" },
  { id: "hyp3", title: "Partner ecosystem — analytics vendors", status: "REVIEWING", description: "Review queue populated from hypothesis fan-out. 8 accounts pending approval.", accounts: [5, 8], contacts: [12, 24], created: "Jun 10, 2026" },
];

export const newsSignals: NewsSignal[] = [
  { id: "n1", headline: "Regional retailer unveils unified commerce data platform", snippet: "Nova Retail Group announced a new analytics layer for store and e-commerce teams.", source: "RetailWire", company: "Nova Retail Group", date: "Jun 2, 2026 10:40", category: "Integrated", priority: "high", score: 85, status: "reviewed", vertical: "Retail" },
  { id: "n2", headline: "Logistics operator expands planning team ahead of peak season", snippet: "Summit Logistics posted three director-level openings in network planning.", source: "SupplyChainNews", company: "Summit Logistics", date: "Jun 1, 2026 14:20", category: "Data / API", priority: "high", score: 78, status: "new", vertical: "Transportation" },
  { id: "n3", headline: "Healthcare network selects new RevOps stack", snippet: "Brightline Health named a consolidated CRM and forecasting vendor.", source: "HealthTech Daily", company: "Brightline Health", date: "May 30, 2026 09:15", category: "Advertising", priority: "medium", score: 72, status: "in_progress", vertical: "Healthcare" },
  { id: "n4", headline: "FinTech startup closes seed extension", snippet: "Atlas FinTech raised additional capital to expand enterprise integrations.", source: "Venture Brief", company: "Atlas FinTech", date: "May 28, 2026 16:00", category: "Integrated", priority: "medium", score: 68, status: "complete", vertical: "Financial Services" },
];

export const newsStats = { total: 842, advertising: 8, dataApi: 11, integrated: 34, excluded: 218 };

export const conferences: Conference[] = [
  { id: "conf1", name: "Industry Summit '26", dates: "May 1–4, 2026", location: "Chicago, IL (Metro Convention Center)", attendees: 412, matched: 38, attending: ["Alex M.", "Jordan L.", "Sam R."], crmList: 186 },
  { id: "conf2", name: "RevOps Exchange 2026", dates: "Sep 14–16, 2026", location: "Austin, TX", attendees: 290, matched: 22, attending: ["Jordan L.", "Casey T."] },
];

export const parkingIdeas: ParkingIdea[] = [
  { id: "p1", title: "CRM integration to Acme SDR", quadrant: "quick-win", impact: 60, readiness: 60, staleDays: 12 },
  { id: "p2", title: "Trade show automation playbooks", quadrant: "high-potential", dealType: "Integrated", vertical: "All verticals", blocker: "Need event budget approval", staleDays: 21, impact: 75, readiness: 35 },
  { id: "p3", title: "Enterprise partner channel", quadrant: "high-potential", dealType: "Partner", blocker: "Legal review pending", staleDays: 18, impact: 80, readiness: 40 },
  { id: "p4", title: "Channel sales program", quadrant: "needs-thinking", impact: 55, readiness: 45 },
];

export const linkedInTeammates: LinkedInTeammate[] = [
  { id: "li1", name: "Jordan Lee", connected: "Apr 12, 2026", lastSync: "Jun 10, 2026", connections: 2140, matched: 128 },
  { id: "li2", name: "Sam Rivera", connected: "May 3, 2026", lastSync: "Jun 11, 2026", connections: 1890, matched: 96 },
  { id: "li3", name: "Alex Morgan", connected: "May 18, 2026", lastSync: "Jun 8, 2026", connections: 1560, matched: 74 },
];

export const linkedInTotals = {
  imported: 5590,
  matched: 298,
  accountsAffected: 89,
  lastRun: "Jun 11, 2026",
};

export const sdrGptSuggestions = [
  "Summarize the open pipeline by stage",
  "Which open deals have gone cold?",
  "Which contacts haven't been touched in the last 30 days?",
  "Export deals in Partner pipeline with company and last contact date",
];

export const integrations = [
  { name: "CRM (HubSpot-style)", status: "connected" as const, detail: "Read/write sync for deals, contacts, sequences" },
  { name: "Apollo.io", status: "connected" as const, detail: "Sequence performance + net-new prospecting" },
  { name: "LinkedIn", status: "partial" as const, detail: "OAuth + CSV connection import" },
  { name: "Gmail", status: "connected" as const, detail: "Action Hub send + activity logging" },
];

export function mockGptResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("pipeline") && p.includes("stage")) {
    return "**Open pipeline by stage (Enterprise Sales Pipeline)**\n\n• Proposal: 4 deals · $112K\n• Qualified: 6 deals · $84K\n• Discovery: 3 deals · $41K\n• Trial Started: 2 deals · unweighted\n\nWeighted total: **$742K** across 186 open deals.";
  }
  if (p.includes("cold") || p.includes("stale")) {
    return "**Deals with no activity in 21+ days:**\n\n1. Coastal Events — Integration ($15K) — last touch May 12\n2. Brightline Health — Renewal ($22K) — last touch May 20\n3. Atlas FinTech — Starter — closed won, missing contract dates\n\nRecommend manager review on items 1–2.";
  }
  if (p.includes("contact") && p.includes("30")) {
    return "**Contacts not touched in 30 days:** 14 total\n\n• Riley Park @ Harbor Media (42 days)\n• Taylor Brooks @ Atlas FinTech (38 days)\n• 12 others in Mid-Market pipeline\n\nExport available as CSV from this thread.";
  }
  if (p.includes("csv") || p.includes("export")) {
    return "Generated **acme-partner-deals.csv** (demo):\n\n| Company | Deal | Stage | Last contact |\n| Harbor Media | API bundle | Qualified | Jun 8 |\n| Coastal Events | Integration | Discovery | May 12 |\n\n*Read-only demo — no CRM write.*";
  }
  return "I can help with read-only CRM lookups in this demo: pipeline summaries, stale deals, contact activity, and CSV exports. Try one of the suggested prompts above.";
}
