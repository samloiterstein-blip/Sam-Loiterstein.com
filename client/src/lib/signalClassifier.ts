export type SignalCategory =
  | "Funding"
  | "Product launch"
  | "Leadership change"
  | "Partnership"
  | "Expansion"
  | "Low relevance";

export type SignalResult = {
  category: SignalCategory;
  confidence: number;
  hook: string;
  rationale: string;
};

type Rule = {
  category: SignalCategory;
  keywords: string[];
  hook: string;
  rationale: string;
};

const rules: Rule[] = [
  {
    category: "Funding",
    keywords: ["raises", "raised", "series", "seed round", "funding", "investment", "venture", "capital"],
    hook: "Congrats on the round — curious how you're scaling outbound now that budget is unlocked.",
    rationale: "Funding events correlate with tooling and headcount expansion.",
  },
  {
    category: "Product launch",
    keywords: ["launches", "launch", " unveils", "introduces", "new product", "beta", "release"],
    hook: "Saw the launch — are reps getting enough signal context to personalize follow-up at volume?",
    rationale: "Product launches create outbound timing windows for adjacent tools.",
  },
  {
    category: "Leadership change",
    keywords: ["appoints", "named ceo", "new ceo", "new cfo", "chief revenue", "president", "joins as"],
    hook: "With the leadership shift, is RevOps getting a fresh look at pipeline definitions?",
    rationale: "Leadership changes often reset GTM priorities and vendor reviews.",
  },
  {
    category: "Partnership",
    keywords: ["partners with", "partnership", "collaboration", "integrates", "alliance", "strategic partner"],
    hook: "The partnership opens new accounts — how are you routing those into sequences today?",
    rationale: "Partnerships expand TAM and create cross-sell outbound angles.",
  },
  {
    category: "Expansion",
    keywords: ["opens office", "expands to", "hiring", "new market", "acquires", "acquisition", "merger"],
    hook: "Expansion usually strains CRM hygiene — worth a quick look at how stages map to reality?",
    rationale: "Geographic or M&A expansion increases pipeline complexity.",
  },
];

export const sampleHeadlines = [
  "Acme Corp raises $40M Series B to scale enterprise sales",
  "JamBase launches API tier for live event data partners",
  "Northwind Media appoints new Chief Revenue Officer",
  "Harbor Analytics partners with major ticketing platform",
  "Local coffee chain opens fifth location downtown",
];

export function classifySignal(text: string): SignalResult {
  const normalized = text.toLowerCase().trim();
  if (!normalized) {
    return {
      category: "Low relevance",
      confidence: 0,
      hook: "Paste a headline to classify outbound relevance.",
      rationale: "No input provided.",
    };
  }

  let best: Rule | null = null;
  let hits = 0;

  for (const rule of rules) {
    const matchCount = rule.keywords.filter((kw) => normalized.includes(kw)).length;
    if (matchCount > hits) {
      hits = matchCount;
      best = rule;
    }
  }

  if (!best || hits === 0) {
    return {
      category: "Low relevance",
      confidence: 42,
      hook: "Signal is weak — park for nurture or enrich with account context before outbound.",
      rationale: "No strong deal-relevant keywords detected in headline.",
    };
  }

  const confidence = Math.min(94, 55 + hits * 12);
  return {
    category: best.category,
    confidence,
    hook: best.hook,
    rationale: best.rationale,
  };
}
