const clichePhrases = [
  "game-changer",
  "game changer",
  "excited to share",
  "thrilled to announce",
  "delighted to",
  "transform how we think",
  "revolutionize",
  "synergy",
  "leverage",
  "best-in-class",
  "cutting-edge",
  "in today's fast-paced",
  "at the end of the day",
  "it's not just about",
  "journey",
  "landscape",
  "unlock",
  "empower",
];

const voiceMarkers = [
  { id: "specificity", label: "Specific claim or timeframe", test: (t: string) => /\b(last|this|month|week|quarter|\d+)\b/i.test(t) },
  { id: "contrast", label: "Problem vs. fix contrast", test: (t: string) => /\b(but|still|before|after|instead)\b/i.test(t) },
  { id: "short-open", label: "Direct opening (≤8 words)", test: (t: string) => {
    const first = t.split(/[.!?]/)[0]?.trim() ?? "";
    return first.split(/\s+/).length <= 8 && first.length > 0;
  }},
  { id: "no-hype", label: "Avoids hype adjectives", test: (t: string) => !/\b(amazing|incredible|unprecedented|groundbreaking)\b/i.test(t) },
  { id: "reader", label: "Addresses reader context", test: (t: string) => /\b(you|your|we|reps|teams|leaders)\b/i.test(t) },
];

export type VoiceAnalysis = {
  clicheScore: number;
  clicheHits: string[];
  avgSentenceLength: number;
  lengthVariance: number;
  voiceScore: number;
  markers: { label: string; passed: boolean }[];
  summary: string;
};

export const starterDrafts = {
  generic:
    "Excited to share progress on our RevOps journey! This game-changer dashboard will transform how we think about sales operations.",
  voice:
    "We shipped a RevOps dashboard last month. Reps still keep parallel spreadsheets for outbound prep. Fix stage labels before you fix the chart.",
};

function sentenceStats(text: string) {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) return { avg: 0, variance: 0 };
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, len) => sum + (len - avg) ** 2, 0) / lengths.length;
  return { avg, variance: Math.sqrt(variance) };
}

export function analyzeDraft(text: string): VoiceAnalysis {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      clicheScore: 0,
      clicheHits: [],
      avgSentenceLength: 0,
      lengthVariance: 0,
      voiceScore: 0,
      markers: voiceMarkers.map((m) => ({ label: m.label, passed: false })),
      summary: "Paste a draft to analyze voice quality.",
    };
  }

  const lower = trimmed.toLowerCase();
  const clicheHits = clichePhrases.filter((p) => lower.includes(p));
  const clicheScore = Math.min(100, clicheHits.length * 22 + (lower.match(/!/g)?.length ?? 0) * 8);

  const { avg, variance } = sentenceStats(trimmed);
  const markers = voiceMarkers.map((m) => ({ label: m.label, passed: m.test(trimmed) }));
  const passedCount = markers.filter((m) => m.passed).length;
  const voiceScore = Math.round(
    Math.max(0, Math.min(100, passedCount * 18 - clicheScore * 0.35 + Math.min(variance, 6) * 3))
  );

  let summary: string;
  if (voiceScore >= 70) {
    summary = "Strong voice — specific, grounded, and publish-ready with minor polish.";
  } else if (voiceScore >= 45) {
    summary = "Mixed — trim hype and add a concrete problem/fix contrast.";
  } else {
    summary = "Reads generic — replace clichés with a specific claim and reader context.";
  }

  return {
    clicheScore,
    clicheHits,
    avgSentenceLength: Math.round(avg * 10) / 10,
    lengthVariance: Math.round(variance * 10) / 10,
    voiceScore,
    markers,
    summary,
  };
}
