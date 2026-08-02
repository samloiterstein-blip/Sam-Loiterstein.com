export type Segment = "enterprise" | "mid-market" | "smb";
export type Stage = "discovery" | "qualified" | "proposal" | "negotiation" | "stalled";

export type DealInput = {
  segment: Segment;
  stage: Stage;
  daysInStage: number;
  lastActivityDays: number;
  championIdentified: boolean;
};

export type DealScore = {
  tier: 1 | 2 | 3 | 4;
  tierLabel: string;
  probability: number;
  action: string;
  rationale: string;
};

const tierMeta: Record<number, { label: string; base: number }> = {
  1: { label: "Tier 1", base: 65 },
  2: { label: "Tier 2", base: 40 },
  3: { label: "Tier 3", base: 18 },
  4: { label: "Tier 4", base: 6 },
};

const stageWeight: Record<Stage, number> = {
  discovery: -12,
  qualified: 0,
  proposal: 10,
  negotiation: 18,
  stalled: -20,
};

const segmentWeight: Record<Segment, number> = {
  enterprise: 8,
  "mid-market": 4,
  smb: -4,
};

export function scoreDeal(input: DealInput): DealScore {
  let score = 35;
  score += stageWeight[input.stage];
  score += segmentWeight[input.segment];

  if (input.championIdentified) score += 12;
  else score -= 8;

  if (input.daysInStage > 45) score -= 15;
  else if (input.daysInStage > 21) score -= 8;
  else if (input.daysInStage <= 7) score += 4;

  if (input.lastActivityDays > 21) score -= 14;
  else if (input.lastActivityDays > 14) score -= 8;
  else if (input.lastActivityDays <= 3) score += 6;

  score = Math.max(2, Math.min(85, score));

  let tier: 1 | 2 | 3 | 4;
  if (score >= 58) tier = 1;
  else if (score >= 38) tier = 2;
  else if (score >= 20) tier = 3;
  else tier = 4;

  const { label, base } = tierMeta[tier];
  const probability = Math.round(Math.max(2, Math.min(85, base + (score - base) * 0.35)));

  let action: string;
  let rationale: string;

  if (tier === 1) {
    action = "Prioritize in forecast";
    rationale = "Strong stage progress, recent activity, and champion coverage support inclusion this week.";
  } else if (tier === 2) {
    action = "Advance with next-step plan";
    rationale = "Viable opportunity — tighten timeline and confirm economic buyer before forecast lock.";
  } else if (tier === 3) {
    action = "Manager review";
    rationale = "Signals are mixed or aging. Validate champion and re-stage before counting in pipeline.";
  } else {
    action = "Deprioritize";
    rationale = "Stalled or weak engagement. Move to nurture or close-lost review.";
  }

  if (input.stage === "stalled" && input.lastActivityDays > 14) {
    action = "Manager intervention";
    rationale = "Deal is stalled with no recent activity — schedule a rescue call or deprioritize.";
  }

  return { tier, tierLabel: label, probability, action, rationale };
}
