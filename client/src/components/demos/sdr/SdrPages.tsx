import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  LayoutGrid,
  Linkedin,
  Mail,
  Newspaper,
  Plug,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  Upload,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  KpiCard,
  pageWrap,
  PageHeader,
  Pill,
  TableShell,
  Tag,
  Td,
  Th,
  usePageWrap,
} from "./SdrUi";
import { useSdrDense } from "./SdrDenseContext";
import {
  accounts,
  actionHubRenewals,
  actionHubTrials,
  APP_NAME,
  APP_SUBTITLE,
  conferences,
  contacts,
  deals,
  hypotheses,
  integrations,
  linkedInTeammates,
  linkedInTotals,
  mockGptResponse,
  newsSignals,
  newsStats,
  parkingIdeas,
  pipelines,
  revopsDealsByCompany,
  revopsFunnel,
  revopsHygiene,
  sdrGptSuggestions,
  sequenceStats,
  sequences,
  type ActionHubItem,
  type NavId,
  type NewsSignal,
} from "@/data/acmeSdrDemo";

const fmt = (n: number) =>
  n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n.toLocaleString()}`;

export function AccountsPage() {
  return (
    <div className={pageWrap}>
      <PageHeader
        eyebrow="Pipeline"
        title="Accounts"
        description="Tiered target accounts with CRM match status."
      />
      <TableShell>
        <thead>
          <tr>
            <Th>Account</Th>
            <Th>Tier</Th>
            <Th>Industry</Th>
            <Th>Contacts</Th>
            <Th>Open deals</Th>
            <Th>Last activity</Th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id} className="hover:bg-sage-50/40">
              <Td className="font-medium text-ink-900">
                <div>{a.name}</div>
                <div className="text-[10px] font-normal text-ink-400">{a.domain}</div>
              </Td>
              <Td>
                <Tag tone="brand">{a.tier}</Tag>
              </Td>
              <Td>{a.industry}</Td>
              <Td>{a.contacts}</Td>
              <Td>{a.openDeals}</Td>
              <Td className="text-ink-500">{a.lastActivity}</Td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </div>
  );
}

export function ContactsPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchTag =
        tag === "all" ||
        (tag === "stale" && c.dataQuality.includes("stale")) ||
        (tag === "missing" && c.dataQuality.includes("missing_phone"));
      return matchQ && matchTag;
    });
  }, [query, tag]);

  return (
    <div className={pageWrap}>
      <header>
        <h1 className="font-display text-xl text-ink-900">Contacts</h1>
        <p className="text-xs text-ink-500">CRM contacts with data quality flags and owner assignment.</p>
      </header>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="absolute left-2.5 top-2.5 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, email…"
            className="w-full rounded-lg border border-ink-100 py-2 pl-8 pr-3 text-xs"
          />
        </div>
        {(["all", "stale", "missing"] as const).map((t) => (
          <Pill key={t} active={tag === t} onClick={() => setTag(t)}>
            {t === "all" ? "All" : t === "stale" ? "Stale" : "Missing phone"}
          </Pill>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white/95 ring-1 ring-sage-200/70">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-ink-100 bg-ink-50/80 text-[10px] uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Last contact</th>
              <th className="px-3 py-2">Flags</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-ink-50">
                <td className="px-3 py-2.5">
                  <div className="font-medium text-ink-900">{c.name}</div>
                  <div className="text-[10px] text-ink-400">{c.email}</div>
                </td>
                <td className="px-3 py-2.5 text-ink-600">{c.company}</td>
                <td className="px-3 py-2.5 text-ink-600">{c.owner}</td>
                <td className="px-3 py-2.5 text-ink-500">{c.lastContact ?? "—"}</td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {c.dataQuality.map((d) => (
                      <span key={d} className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] text-amber-800">
                        {d.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionHubTable({
  items,
  onDone,
}: {
  items: ActionHubItem[];
  onDone: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white/95 ring-1 ring-sage-200/70">
      <table className="w-full min-w-[640px] text-left text-[11px]">
        <thead className="border-b border-ink-100 bg-ink-50/80 text-[10px] uppercase tracking-wider text-ink-500">
          <tr>
            <th className="px-3 py-2">Deal</th>
            <th className="px-3 py-2">Company</th>
            <th className="px-3 py-2">Contact</th>
            <th className="px-3 py-2">Ends</th>
            <th className="px-3 py-2">Timing</th>
            <th className="px-3 py-2">Last contact</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className={cn("border-b border-ink-50", row.done && "opacity-40")}>
              <td className="px-3 py-2 font-medium text-ink-900">{row.deal}</td>
              <td className="px-3 py-2 text-ink-600">{row.company}</td>
              <td className="px-3 py-2">
                <div>{row.contact}</div>
                <div className="text-[10px] text-ink-400">{row.contactEmail}</div>
              </td>
              <td className="px-3 py-2 text-ink-600">{row.ends}</td>
              <td className="px-3 py-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    row.timingDays <= 1 ? "bg-amber-100 text-amber-900" : "bg-orange-100 text-orange-900"
                  )}
                >
                  {row.timingDays}d left
                </span>
              </td>
              <td className="px-3 py-2 text-ink-500">{row.lastContact ?? "No contact logged"}</td>
              <td className="px-3 py-2">
                <div className="flex gap-1">
                  <button type="button" className="flex items-center gap-1 rounded border border-ink-200 px-2 py-1 hover:bg-ink-50">
                    <Send size={10} /> Send
                  </button>
                  <button
                    type="button"
                    onClick={() => onDone(row.id)}
                    className="rounded border border-ink-200 px-2 py-1 hover:bg-sage-50"
                  >
                    Done
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DealsPage() {
  const [tab, setTab] = useState<"all" | "action">("all");
  const [actionKind, setActionKind] = useState<"trial" | "renewal">("trial");
  const [trials, setTrials] = useState(actionHubTrials);
  const [renewals, setRenewals] = useState(actionHubRenewals);
  const [search, setSearch] = useState("");

  const filteredDeals = useMemo(() => {
    const q = search.toLowerCase();
    return deals.filter(
      (d) =>
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q)
    );
  }, [search]);

  const actionItems = (actionKind === "trial" ? trials : renewals).filter((i) => !i.done);

  const markDone = (id: string) => {
    if (actionKind === "trial") {
      setTrials((prev) => prev.map((i) => (i.id === id ? { ...i, done: true } : i)));
    } else {
      setRenewals((prev) => prev.map((i) => (i.id === id ? { ...i, done: true } : i)));
    }
  };

  return (
    <div className={pageWrap}>
      <div className="flex gap-2">
        <Pill active={tab === "all"} onClick={() => setTab("all")}>All Deals</Pill>
        <Pill active={tab === "action"} onClick={() => setTab("action")}>Action Hub</Pill>
      </div>

      {tab === "all" ? (
        <>
          <header>
            <h1 className="font-display text-xl text-ink-900">Deals</h1>
            <p className="text-xs text-ink-500">Every CRM deal across pipelines. Filter by stage, owner, amount, and close date.</p>
          </header>
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-2.5 top-2.5 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or deal…"
              className="w-full rounded-lg border border-ink-100 py-2 pl-8 pr-3 text-xs"
            />
          </div>
          <div className="overflow-x-auto rounded-2xl bg-white/95 ring-1 ring-sage-200/70">
            <table className="w-full min-w-[720px] text-left text-[11px]">
              <thead className="border-b border-ink-100 bg-ink-50/80 text-[10px] uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-3 py-2">Deal</th>
                  <th className="px-3 py-2">Pipeline</th>
                  <th className="px-3 py-2">Stage</th>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Close</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((d) => (
                  <tr key={d.id} className="border-b border-ink-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 font-medium text-sage-700">
                        {d.name}
                        <ExternalLink size={10} />
                      </div>
                      <div className="text-[10px] text-ink-400">{d.company}</div>
                    </td>
                    <td className="px-3 py-2 text-ink-600">{d.pipeline}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px]">{d.stage}</span>
                    </td>
                    <td className="px-3 py-2 text-ink-600">{d.owner}</td>
                    <td className="px-3 py-2 text-ink-600">{d.amount ? fmt(d.amount) : "Not set"}</td>
                    <td className="px-3 py-2 text-ink-500">{d.closeDate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <header>
            <h1 className="font-display text-xl text-ink-900">Action Hub</h1>
            <p className="text-xs text-ink-500">Time-sensitive deals that need a touch this week.</p>
          </header>
          <div className="flex flex-wrap gap-2">
            <Pill active={actionKind === "trial"} onClick={() => setActionKind("trial")}>Expired data trials</Pill>
            <Pill active={actionKind === "renewal"} onClick={() => setActionKind("renewal")}>Upcoming renewals</Pill>
          </div>
          <p className="text-xs text-ink-500">{actionItems.length} to action</p>
          <ActionHubTable items={actionItems} onDone={markDone} />
        </>
      )}
    </div>
  );
}

export function SequencesPage() {
  const [view, setView] = useState<"overview" | "list">("overview");
  const s = sequenceStats;

  return (
    <div className={pageWrap}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl text-ink-900">Sequences</h1>
          <p className="text-xs text-ink-500">Outreach overview — CRM + Apollo performance in one view.</p>
        </div>
        <button type="button" className="flex items-center gap-1 rounded-lg border border-ink-200 px-2 py-1 text-[11px] hover:bg-ink-50">
          <RefreshCw size={12} /> Refresh
        </button>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <KpiCard label="Total emails sent" value={s.totalEmails.toLocaleString()} sub={`${s.hubspotEmails} CRM + ${s.apolloDelivered} Apollo`} />
        <KpiCard label="Reply rate" value={`${s.replyRate}%`} sub={`${s.totalReplies} replies`} />
        <KpiCard label="Meetings booked" value={String(s.meetingsBooked)} sub="Last 90 days" />
        <KpiCard label="Contacts enrolled" value={String(s.contactsEnrolled)} sub="All time" />
      </div>

      <button type="button" onClick={() => setView(view === "overview" ? "list" : "overview")} className="text-xs font-medium text-sage-700">
        {view === "overview" ? "Show sequence list →" : "← Back to overview"}
      </button>

      {view === "list" && (
        <div className="space-y-2">
          {sequences.map((seq) => (
            <div key={seq.id} className="rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-ink-900">{seq.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[9px]">{seq.source}</span>
                    <span className="rounded bg-sage-100 px-1.5 py-0.5 text-[9px] text-sage-900">{seq.status}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-ink-400" />
              </div>
              {seq.delivered != null ? (
                <div className="mt-2 grid grid-cols-5 gap-2 text-center text-[9px]">
                  <div><div className="font-mono text-sm">{seq.steps}</div>Steps</div>
                  <div><div className="font-mono text-sm">{seq.delivered}</div>Delivered</div>
                  <div><div className="font-mono text-sm text-orange-600">{seq.openRate}%</div>Open</div>
                  <div><div className="font-mono text-sm text-orange-600">{seq.replyRate}%</div>Reply</div>
                  <div><div className="font-mono text-sm">{seq.bounceRate}%</div>Bounce</div>
                </div>
              ) : (
                <p className="mt-2 text-[10px] text-ink-500">
                  {seq.crmEnrolled} enrolled in CRM · link Apollo for live stats
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RevOpsPage() {
  const [tab, setTab] = useState<"funnel" | "deals" | "weekly" | "hygiene">("funnel");
  const [pipeline, setPipeline] = useState<string>(pipelines[0]);
  const dense = useSdrDense();
  const wrap = usePageWrap();
  const f = revopsFunnel;
  const attainment = Math.round((f.closedWon / f.target) * 100);
  const coverage = (f.forecast / f.target).toFixed(1);

  return (
    <div className={wrap}>
      <header className={cn("flex flex-wrap items-start justify-between gap-2", dense && "gap-1.5")}>
        <div className="min-w-0">
          <h1 className={cn("font-display text-ink-900", dense ? "text-sm leading-tight" : "text-xl")}>
            RevOps Pipeline & Forecasting
          </h1>
          {!dense && (
            <p className="text-xs text-ink-500">Live CRM analytics, forecasting, and hygiene.</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          <select
            value={pipeline}
            onChange={(e) => setPipeline(e.target.value)}
            className={cn(
              "rounded-lg border border-ink-200 text-ink-700",
              dense ? "max-w-[9rem] px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[11px]"
            )}
          >
            {pipelines.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button
            type="button"
            className={cn(
              "rounded-lg border border-ink-200 text-ink-600",
              dense ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[11px]"
            )}
          >
            XLSX
          </button>
          <button
            type="button"
            className={cn(
              "rounded-lg border border-ink-200 text-ink-600",
              dense ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[11px]"
            )}
          >
            PPTX
          </button>
        </div>
      </header>

      <div className={cn("flex flex-wrap gap-1.5", dense && "gap-1")}>
        {(["funnel", "deals", "weekly", "hygiene"] as const).map((t) => (
          <Pill key={t} active={tab === t} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Pill>
        ))}
      </div>

      {tab === "funnel" && (
        <>
          <div className={cn("grid gap-2", dense ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
            <KpiCard label="Target" value={fmt(f.target)} sub={f.quarter} />
            <KpiCard label="Closed-won" value={fmt(f.closedWon)} sub={`${attainment}% of target`} />
            <KpiCard label="Forecast coverage" value={`${coverage}x`} sub={`${fmt(f.forecast)} forecast`} />
            <KpiCard label="Gap to target" value={fmt(f.target - f.closedWon)} sub="still to book" />
          </div>
          <div className={cn("rounded-2xl bg-white/95 ring-1 ring-sage-200/70", dense ? "p-2.5" : "p-4")}>
            <div className={cn("font-medium text-ink-700", dense ? "text-[10px]" : "text-xs")}>
              Funnel — {pipeline}
            </div>
            <div className={cn("space-y-3", dense && "mt-2 space-y-2")}>
              {[
                { label: "Target", value: f.target, color: "bg-ink-300" },
                { label: "Forecast", value: f.forecast, color: "bg-sage-800" },
                { label: "Closed-won", value: f.closedWon, color: "bg-sage-700" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-0.5 flex justify-between text-[10px] text-ink-500">
                    <span>{row.label}</span>
                    <span>{fmt(row.value)}</span>
                  </div>
                  <div className={cn("overflow-hidden rounded-full bg-ink-100", dense ? "h-2" : "h-3")}>
                    <div
                      className={cn("h-full rounded-full", row.color)}
                      style={{ width: `${Math.min(100, (row.value / f.forecast) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "deals" && (
        <div className="overflow-x-auto rounded-2xl bg-white/95 ring-1 ring-sage-200/70">
          <table className="w-full min-w-[640px] text-left text-[11px]">
            <thead className="border-b border-ink-100 bg-ink-50/80 text-[10px] uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-3 py-2">Deal</th>
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2">Owner</th>
                <th className="px-3 py-2">Forecast</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Weighted</th>
              </tr>
            </thead>
            <tbody>
              {revopsDealsByCompany.map((d) => (
                <tr key={d.deal} className="border-b border-ink-50">
                  <td className="px-3 py-2">
                    <div className="font-medium text-ink-900">{d.company}</div>
                    <div className="text-[10px] text-sage-700">{d.deal}</div>
                  </td>
                  <td className="px-3 py-2">{d.stage}</td>
                  <td className="px-3 py-2">{d.owner}</td>
                  <td className="px-3 py-2">{d.forecast}</td>
                  <td className="px-3 py-2">{fmt(d.amount)}</td>
                  <td className="px-3 py-2">{fmt(d.weighted)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "weekly" && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <KpiCard label="Bookings FY26" value={fmt(128000)} sub="closed-won YTD" />
            <KpiCard label="Derived target" value={fmt(412000)} sub="from monthly CRM goals" />
            <KpiCard label="Attainment" value="31%" sub="to target" />
          </div>
          <div className="rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-4">
            <div className="text-xs font-medium text-ink-700">Weekly bookings vs target</div>
            <div className="mt-4 flex h-32 items-end gap-1">
              {[12, 8, 18, 22, 14, 28, 16, 20, 10, 24, 18, 30].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-sage-700/80"
                  style={{ height: `${h * 3}px` }}
                  title={`Week ${i + 1}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-ink-400">
              <span>Jan</span><span>Jun</span><span>Dec</span>
            </div>
          </div>
        </div>
      )}

      {tab === "hygiene" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="flex items-center gap-1 rounded-lg border border-ink-200 px-2 py-1 text-[11px]">
              <Download size={12} /> Download CSV
            </button>
            <button type="button" className="flex items-center gap-1 rounded-lg border border-ink-200 px-2 py-1 text-[11px]">
              <Upload size={12} /> Upload CSV
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <KpiCard label="Hygiene score" value={`${revopsHygiene.score}%`} sub={`${revopsHygiene.clean} of ${revopsHygiene.total} clean`} />
            <KpiCard label="Flagged deals" value={String(revopsHygiene.flagged)} />
            <KpiCard label="Won missing dates" value={String(revopsHygiene.wonMissingDates)} />
          </div>
          <div className="flex flex-wrap gap-1">
            {revopsHygiene.chips.map((c) => (
              <span key={c.label} className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] text-ink-600">
                {c.label} ({c.count})
              </span>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl bg-white/95 ring-1 ring-sage-200/70">
            <table className="w-full text-left text-[11px]">
              <thead className="border-b border-ink-100 bg-ink-50/80 text-[10px] uppercase text-ink-500">
                <tr>
                  <th className="px-3 py-2">Deal</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Closed</th>
                  <th className="px-3 py-2">Missing</th>
                </tr>
              </thead>
              <tbody>
                {revopsHygiene.issues.map((row) => (
                  <tr key={row.id} className="border-b border-ink-50">
                    <td className="px-3 py-2">{row.deal}</td>
                    <td className="px-3 py-2">{row.company}</td>
                    <td className="px-3 py-2">{row.closed}</td>
                    <td className="px-3 py-2">
                      {row.missing.map((m) => (
                        <span key={m} className="mr-1 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] text-blue-800">{m}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function SdrGptPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: mockGptResponse(text) },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <header className="mb-3">
        <h1 className="flex items-center gap-2 font-display text-xl text-ink-900">
          <Sparkles size={18} className="text-sage-700" /> SDR-GPT
        </h1>
        <p className="text-xs text-ink-500">Read-only CRM assistant — grounded in live demo data.</p>
      </header>

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 bg-white/80 p-6 text-center">
          <p className="text-sm font-medium text-ink-800">Ask SDR-GPT anything about your CRM</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {sdrGptSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-ink-200 px-3 py-1.5 text-[11px] text-ink-600 hover:text-sage-800 hover:ring-1 hover:ring-sage-300"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg px-3 py-2 text-xs whitespace-pre-wrap",
                m.role === "user" ? "ml-8 bg-sage-100 text-ink-800" : "mr-8 bg-white ring-1 ring-sage-100 text-ink-700"
              )}
            >
              {m.text}
            </div>
          ))}
        </div>
      )}

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about contacts, deals, pipeline…"
          className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-xs"
        />
        <button type="submit" className="rounded-lg bg-sage-700 px-3 py-2 text-white">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

export function DealSignalsPage() {
  return (
    <div className={pageWrap}>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-orange-600">Signal prospecting engine</p>
          <h1 className="font-display text-xl text-ink-900">Signals</h1>
          <p className="text-xs text-ink-500">Build a hypothesis, fan out to net-new accounts, dedup against CRM.</p>
        </div>
        <button type="button" className="rounded-lg bg-sage-700 px-3 py-1.5 text-xs font-medium text-white">+ New hypothesis</button>
      </header>
      <div className="space-y-2">
        {hypotheses.map((h) => (
          <div key={h.id} className="rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-ink-900">{h.title}</div>
                <span
                  className={cn(
                    "mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-medium",
                    h.status === "RESEARCHING" && "bg-emerald-100 text-emerald-900",
                    h.status === "DRAFT" && "bg-amber-100 text-amber-900",
                    h.status === "REVIEWING" && "bg-blue-100 text-blue-900"
                  )}
                >
                  {h.status}
                </span>
              </div>
              <div className="text-right text-[10px] text-ink-500">
                <div>{h.accounts[0]} / {h.accounts[1]} accounts</div>
                <div>{h.contacts[0]} / {h.contacts[1]} contacts</div>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-ink-600">{h.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewsPage() {
  const [category, setCategory] = useState<string>("All");
  const [items, setItems] = useState(newsSignals);

  const filtered = category === "All" ? items : items.filter((n) => n.category === category);

  const updateStatus = (id: string, status: NewsSignal["status"]) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
  };

  return (
    <div className={pageWrap}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-xl text-ink-900">
            <Newspaper size={18} /> News Signals
          </h1>
          <p className="text-xs text-ink-500">Buying signals filtered for Acme deal triggers.</p>
        </div>
        <button type="button" className="flex items-center gap-1 rounded-lg bg-sage-700 px-3 py-1.5 text-xs text-white">
          <RefreshCw size={12} /> Refresh feeds
        </button>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <KpiCard label="Total signals" value={String(newsStats.total)} />
        <KpiCard label="Advertising" value={String(newsStats.advertising)} />
        <KpiCard label="Data / API" value={String(newsStats.dataApi)} />
        <KpiCard label="Integrated" value={String(newsStats.integrated)} />
        <KpiCard label="Excluded" value={String(newsStats.excluded)} />
      </div>

      <div className="flex flex-wrap gap-1">
        {["All", "Advertising", "Data / API", "Integrated"].map((c) => (
          <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Pill>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((n) => (
          <div key={n.id} className="rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-3">
            <div className="flex flex-wrap gap-1">
              <span className="rounded border border-emerald-200 px-1.5 py-0.5 text-[9px] text-emerald-800">{n.category}</span>
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] text-white">{n.priority}</span>
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] text-white">{n.score}/100</span>
              <span className="rounded bg-sage-700 px-1.5 py-0.5 text-[9px] text-white">{n.status}</span>
            </div>
            <a href="#" className="mt-2 block text-sm font-medium text-sage-700 hover:underline">{n.headline}</a>
            <p className="mt-1 text-[11px] text-ink-600">{n.snippet}</p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-ink-400">
              <span>{n.source} · {n.company} · {n.date}</span>
              <button
                type="button"
                onClick={() => updateStatus(n.id, "in_progress")}
                className="rounded border border-ink-200 px-2 py-0.5 hover:bg-ink-50"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConferencesPage() {
  return (
    <div className={pageWrap}>
      <header className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl text-ink-900">Conferences</h1>
          <p className="text-xs text-ink-500">Industry events cross-referenced against CRM and qualified lists.</p>
        </div>
        <button type="button" className="rounded-lg bg-sage-700 px-3 py-1.5 text-xs text-white">+ Add event</button>
      </header>
      <div className="space-y-3">
        {conferences.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg text-ink-900">{c.name}</h2>
                  {c.crmList && (
                    <span className="rounded bg-ink-100 px-2 py-0.5 text-[10px]">CRM list {c.crmList}</span>
                  )}
                </div>
                <div className="mt-2 space-y-1 text-xs text-ink-600">
                  <div className="flex items-center gap-2"><Calendar size={12} /> {c.dates}</div>
                  <div>{c.location}</div>
                  <div>Team attending: {c.attending.join(", ")}</div>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="font-display text-2xl text-ink-900">{c.attendees}</div>
                  <div className="text-[10px] uppercase text-ink-400">Attendees</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-orange-600">{c.matched}</div>
                  <div className="text-[10px] uppercase text-ink-400">Matched ({Math.round((c.matched / c.attendees) * 100)}%)</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const quadrantMeta = {
  "quick-win": { title: "Quick Wins", desc: "Execution-ready — push into outreach next.", color: "border-emerald-200" },
  "high-potential": { title: "High Potential / Not Ready", desc: "Big upside, timing or buyer clarity weak.", color: "border-amber-200" },
  "low-value": { title: "Low Value / Parked", desc: "Probably won't merit action soon.", color: "border-ink-200" },
  "needs-thinking": { title: "Needs More Thinking", desc: "Mid-band — sharpen GTM framing.", color: "border-blue-200" },
};

export function ParkingLotPage() {
  const [query, setQuery] = useState("");
  const ideas = parkingIdeas.filter((p) => !query || p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={pageWrap}>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-400">GTM · Eisenhower matrix</p>
          <h1 className="font-display text-xl text-ink-900">Parking Lot</h1>
          <p className="text-xs text-ink-500">Structured GTM ideas auto-sorted from scoring inputs.</p>
        </div>
        <button type="button" className="rounded-lg bg-sage-700 px-3 py-1.5 text-xs text-white">+ New idea</button>
      </header>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title, use case, hypothesis…"
        className="w-full max-w-md rounded-lg border border-ink-100 px-3 py-2 text-xs"
      />
      <div className="grid gap-3 md:grid-cols-2">
        {(Object.keys(quadrantMeta) as (keyof typeof quadrantMeta)[]).map((q) => {
          const meta = quadrantMeta[q];
          const cards = ideas.filter((p) => p.quadrant === q);
          return (
            <div key={q} className={cn("rounded-xl border bg-white/80 p-3", meta.color)}>
              <div className="text-xs font-semibold text-ink-800">{meta.title}</div>
              <div className="text-[10px] text-ink-500">{meta.desc}</div>
              <div className="mt-2 space-y-2">
                {cards.length === 0 ? (
                  <p className="text-[10px] text-ink-400">Nothing here yet.</p>
                ) : (
                  cards.map((p) => (
                    <div key={p.id} className="rounded-lg border border-ink-100 bg-white p-2 text-[11px]">
                      <div className="font-medium text-ink-900">{p.title}</div>
                      {p.blocker && <div className="mt-1 text-[10px] text-red-600">Blocker: {p.blocker}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LinkedInPage() {
  const [syncing, setSyncing] = useState(false);

  return (
    <div className={pageWrap}>
      <header>
        <h1 className="flex items-center gap-2 font-display text-xl text-ink-900">
          <Linkedin size={18} className="text-sage-700" /> LinkedIn Intelligence
        </h1>
        <p className="text-xs text-ink-500">Connection sync, content performance, and account tiering.</p>
      </header>

      <div className="rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-sage-700 px-3 py-1.5 text-xs text-white">Sign in teammate</button>
          <button
            type="button"
            disabled={syncing}
            onClick={() => {
              setSyncing(true);
              window.setTimeout(() => setSyncing(false), 1500);
            }}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs disabled:opacity-50"
          >
            {syncing ? "Syncing…" : "Sync new only"}
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {linkedInTeammates.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink-50 bg-ink-50/50 px-3 py-2 text-[11px]">
              <div>
                <div className="font-medium text-ink-900">{t.name}</div>
                <div className="text-[10px] text-ink-500">Connected {t.connected} · Last sync {t.lastSync}</div>
              </div>
              <div className="text-ink-600">{t.connections.toLocaleString()} connections · {t.matched} matched</div>
              <button type="button" className="rounded border border-ink-200 px-2 py-1">Upload CSV</button>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 text-[10px]">
          <div><span className="text-ink-400">Imported</span><div className="font-mono text-sm">{linkedInTotals.imported.toLocaleString()}</div></div>
          <div><span className="text-ink-400">Matched to CRM</span><div className="font-mono text-sm">{linkedInTotals.matched}</div></div>
          <div><span className="text-ink-400">Accounts affected</span><div className="font-mono text-sm">{linkedInTotals.accountsAffected}</div></div>
          <div><span className="text-ink-400">Last run</span><div className="font-mono text-sm">{linkedInTotals.lastRun}</div></div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/95 ring-1 ring-sage-200/70 p-4">
        <div className="text-xs font-medium text-ink-700">External business signals</div>
        <p className="mt-1 text-[11px] text-ink-500">Paste LinkedIn post URLs to track in your watchlist.</p>
        <button type="button" className="mt-2 rounded-lg border border-dashed border-ink-200 px-3 py-1.5 text-[11px]">+ Add signal</button>
      </div>
    </div>
  );
}

export function IntegrationsPage() {
  return (
    <div className={pageWrap}>
      <header>
        <h1 className="flex items-center gap-2 font-display text-xl text-ink-900">
          <Plug size={18} /> Integrations
        </h1>
        <p className="text-xs text-ink-500">Connected systems powering the Acme SDR workspace.</p>
      </header>
      <div className="space-y-2">
        {integrations.map((i) => (
          <div key={i.name} className="flex items-center justify-between rounded-2xl bg-white/95 ring-1 ring-sage-200/70 px-4 py-3">
            <div>
              <div className="text-sm font-medium text-ink-900">{i.name}</div>
              <div className="text-[11px] text-ink-500">{i.detail}</div>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                i.status === "connected" && "bg-emerald-100 text-emerald-900",
                i.status === "partial" && "bg-amber-100 text-amber-900"
              )}
            >
              {i.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const navSections: { label: string; items: { id: NavId; label: string; icon: typeof Users }[] }[] = [
  {
    label: "Pipeline",
    items: [
      { id: "accounts", label: "Accounts", icon: Building2 },
      { id: "contacts", label: "Contacts", icon: Users },
      { id: "deals", label: "Deals", icon: Briefcase },
      { id: "sequences", label: "Sequences", icon: Mail },
    ],
  },
  {
    label: "Analytics",
    items: [
      { id: "revops", label: "RevOps", icon: BarChart3 },
      { id: "sdr-gpt", label: "SDR-GPT", icon: Sparkles },
    ],
  },
  {
    label: "Signals",
    items: [
      { id: "deal-signals", label: "Deal Signals", icon: Target },
      { id: "news", label: "News", icon: Newspaper },
    ],
  },
  {
    label: "Plays",
    items: [
      { id: "conferences", label: "Conferences", icon: Calendar },
      { id: "parking-lot", label: "Parking Lot", icon: LayoutGrid },
      { id: "linkedin", label: "LinkedIn Intel", icon: Linkedin },
    ],
  },
];

export function renderSdrPage(id: NavId) {
  switch (id) {
    case "accounts":
      return <AccountsPage />;
    case "contacts":
      return <ContactsPage />;
    case "deals":
      return <DealsPage />;
    case "sequences":
      return <SequencesPage />;
    case "revops":
      return <RevOpsPage />;
    case "sdr-gpt":
      return <SdrGptPage />;
    case "deal-signals":
      return <DealSignalsPage />;
    case "news":
      return <NewsPage />;
    case "conferences":
      return <ConferencesPage />;
    case "parking-lot":
      return <ParkingLotPage />;
    case "linkedin":
      return <LinkedInPage />;
    case "integrations":
      return <IntegrationsPage />;
    default:
      return <AccountsPage />;
  }
}

export { APP_NAME, APP_SUBTITLE };
