/**
 * Single source of truth for site copy.
 * All entries follow AI-Policy.md, config-tone.txt, and STYLE-GUIDE.md.
 */

import type { LucideIcon } from "lucide-react";
import { Layers, LineChart, Shield, Users } from "lucide-react";

// Site / global

export const site = {
  name: "Sam Loiterstein",
  initials: "SL",
  tagline: "Fractional product and AI systems for revenue and operations.",
  description:
    "I help CROs and COOs connect the tools they already use, build the missing product layer, and put AI into workflows their teams can run.",
  email: "samloiterstein@gmail.com",
  location: "Washington, DC",
  resumeUrl: "/Sam-Loiterstein-Resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/sam-loiterstein",
    email: "mailto:samloiterstein@gmail.com",
    github: "https://github.com/samloiterstein-blip",
  },
  githubUser: "samloiterstein-blip",
} as const;

export const navItems = [
  { id: "background", label: "About" },
  { id: "practice-bridge", label: "Past Work" },
  { id: "approach", label: "Engagements" },
  { id: "press", label: "Press" },
  { id: "contact", label: "Contact" },
] as const;

export const sectionCtas = {
  approach: {
    lead: "Start with the operating problem.",
    body: "Tell me which handoff is stalling. I will look at the people, the tools, and the decision before proposing a build.",
    action: "Discuss a project",
    intent: "custom",
  },
  work: {
    lead: "Tell me what your team is trying to change.",
    action: "Discuss a similar system",
    intent: "custom",
  },
  writing: {
    action: "Read the latest piece",
  },
  background: {
    action: "See the record",
  },
  engagements: {
    body: "A first conversation covers the operating problem, who owns it, and whether a scoped build is the right next step.",
    action: "Discuss a project",
    intent: "custom",
  },
} as const;

// Hero

export const hero = {
  eyebrow: "Fractional product leadership. Washington, DC.",
  primaryCta: "Discuss a project",
  primaryIntent: "custom",
  secondaryCta: "See my work",
  rotatingTitles: [
    "Founder & Operator.",
    "Product Lead.",
    "RevOps Architect.",
    "GTM as a Service.",
    "AI Workflows.",
    "Community Builder.",
  ],
  headline: "I help companies left behind by AI",
  headlineEmphasis: "get ahead",
  portraitSrc: "/images/hero-portrait.png",
  portraitAlt: "Sam Loiterstein",
} as const;

// Approach

const builtAt = {
  label: "Built at",
  orgs: [
    { name: "JamBase", logoSrc: "/logos/jambase.png", href: "https://data.jambase.com" },
    { name: "Federal Reserve Bank of St. Louis", logoSrc: "/logos/federal-reserve.png" },
    { name: "BBYO", logoSrc: "/logos/bbyo.png", href: "https://bbyo.org" },
    { name: "Nexus Consulting", logoSrc: "/logos/nexus.png", href: "https://nxsconsultants.com" },
    { name: "The George Washington University", logoSrc: "/logos/gwu.png", href: "https://gwu.edu" },
  ],
} as const;

export const approach = {
  eyebrow: "Approach",
  title: "From the operating problem to a system the team runs.",
  manifesto:
    "I decide what to connect, what to build, and where a person still has to approve the work. Security, scale, and AI choices show up inside the cases.",
} as const;

export type ApproachCard = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export type ApproachTabId = "process" | "security" | "scale" | "ai-ethics";

export type ApproachPoint = {
  title: string;
  body: string;
};

export type CredentialGroupId = "education" | "certifications" | "experience";

export type ApproachTab = {
  id: ApproachTabId;
  label: string;
  headline: string;
  paragraphs: string[];
  record?: {
    id: CredentialGroupId;
    label: string;
    hint: string;
  }[];
  pointsTitle?: string;
  pointsLayout?: "stages" | "grid";
  points?: ApproachPoint[];
  closing?: string;
};

export const approachTabs: ApproachTab[] = [
  {
    id: "process",
    label: "How I work",
    headline: "Understand the operating problem, then build the missing layer.",
    paragraphs: [
      "I map the workflow, the tools already in place, and the decision a manager has to make. Then I decide what to connect, what to build, and what the team will own after I leave.",
      "The work follows four stages.",
    ],
    pointsTitle: "Four stages",
    pointsLayout: "stages",
    points: [
      {
        title: "Understand",
        body: "Map the existing workflow, identify bottlenecks, and define the outcome that matters.",
      },
      {
        title: "Prioritize",
        body: "Translate business needs into clear requirements, evaluate possible solutions, and identify what is worth building.",
      },
      {
        title: "Build",
        body: "Develop, integrate, or configure the solution with feedback from the people who will use it.",
      },
      {
        title: "Improve",
        body: "Measure adoption, document the process, and refine what isn't working.",
      },
    ],
    closing:
      "The result is a system the team can run with the tools and decision rights they already have.",
  },
  {
    id: "security",
    label: "Security",
    headline: "Access, review, and ownership are part of the build.",
    paragraphs: [
      "These systems touch CRM records, account research, partner lists, and drafts that go out under someone's name.",
      "On the JamBase revenue system, AI classifications stay in front of a reviewer, and CRM writes run through a live HubSpot sync the team can see.",
      "The LinkedIn publishing architecture routes a draft through approval before it can be scheduled. The NACS partner map case lists open risks, including an unauthenticated delete route, so they stay visible before broader use.",
    ],
    pointsTitle: "Priorities",
    pointsLayout: "grid",
    points: [
      {
        title: "Access",
        body: "Limit permissions to the people and systems that need them.",
      },
      {
        title: "Data",
        body: "Minimize unnecessary collection, exposure, and movement of sensitive information.",
      },
      {
        title: "Oversight",
        body: "Establish clear approval points for consequential actions and AI-generated outputs.",
      },
      {
        title: "Accountability",
        body: "Document integrations, dependencies, and ownership so teams understand how their systems operate.",
      },
    ],
    closing: "Controls should reflect the organization's data, risks, and applicable requirements.",
  },
  {
    id: "scale",
    label: "Scalability",
    headline: "The first version has to fit the team that will run it.",
    paragraphs: [
      "I start with the smallest system that changes the handoff: a workspace, a classification, a map, or a review step.",
      "Ownership, documentation, and the interface are part of that version. The JamBase workspace, the partner-map ingest flow, and the LinkedIn approval path are each built so a named team can operate them.",
      "Later changes follow actual use: which signals reviewers correct, which partner files arrive in a new format, which report a manager opens.",
    ],
  },
  {
    id: "ai-ethics",
    label: "Responsible AI",
    headline: "AI stays inside a workflow a person can review.",
    paragraphs: [
      "I use AI where the task is classification, drafting, or enrichment, and where the team can see the input and correct the output.",
      "At JamBase, news signals are classified into deal-relevant categories and a reviewer can override the result. That override is kept so the next pass has a record.",
      "The LinkedIn architecture fingerprints an author's writing samples and holds the draft for approval. Genre intelligence keeps taxonomy paths and cluster keys inspectable, so a recommendation can be traced.",
      "If the decision needs a person, the system stops there. The NACS map moves partner records and media outputs without putting a model in charge of the program.",
    ],
  },
];

/** @deprecated Prefer approachTabs.find((t) => t.id === "process") */
export const approachSystem = approachTabs.find((tab) => tab.id === "process") ?? approachTabs[0];

export type Principle = ApproachCard;

export const principlesSection = {
  title: "How I build",
  cta: "Explore related systems",
  ctaHref: "#background",
} as const;

export const principles: Principle[] = [
  {
    title: "Design the operating model",
    body: "Clarify workflow, ownership, and feedback loops before adding complexity.",
    icon: Layers,
  },
  {
    title: "Build trust into the workflow",
    body: "Put approvals, permissions, and decision rights inside the system.",
    icon: Shield,
  },
  {
    title: "Make the data usable",
    body: "Standardize inputs and handoffs before models or dashboards.",
    icon: LineChart,
  },
  {
    title: "Design for adoption",
    body: "Training, documentation, and interfaces belong in the build.",
    icon: Users,
  },
];

// Threads

export type Thread = {
  title: string;
  stakes: string;
  body: string;
  workSlug: string;
  accent: string;
};

export const threadsSection = {
  eyebrow: "Threads",
  title: "Where the work connects",
  description: "Five domains that recur across every system I build.",
};

export const threads: Thread[] = [
  {
    title: "Community",
    stakes: "Hundreds of people arrive with different expectations and one clock.",
    body: "I design programs where orientation stays clear under last-minute change. Convention flows, summer staff structures, and onboarding paths are operating systems, not event checklists.",
    workSlug: "bbyo-conventions",
    accent: "#5c2d91",
  },
  {
    title: "Media",
    stakes: "Readers leave when guidance feels generic or priced out of reach.",
    body: "I build editorial systems with distribution built in: SEO structure, syndication paths, and voice that respects the reader's budget and taste.",
    workSlug: "campus-watch",
    accent: "#002856",
  },
  {
    title: "Analytics",
    stakes: "Leadership debates numbers nobody trusts.",
    body: "I treat forecasting and pipeline views as products. Stage definitions, classification tiers, and reporting need to match how deals actually move.",
    workSlug: "revops-classification",
    accent: "#1b3a6b",
  },
  {
    title: "Startups",
    stakes: "Early teams need capacity without building a full internal bench.",
    body: "I have scaled consulting delivery and consumer product in parallel. The through-line is repeatable systems: cohort training, client playbooks, and scoped MVPs.",
    workSlug: "nexus",
    accent: "#0a0a0a",
  },
  {
    title: "AI",
    stakes: "Models amplify whatever mess they inherit.",
    body: "I apply AI expertise inside workflows with clean data and named failure modes: genre taxonomies, voice-controlled publishing, and signal classification with reviewer feedback loops.",
    workSlug: "genre-intelligence",
    accent: "#ff007f",
  },
];

// Background (formerly resume)

export type TimelineEntry = {
  period: string;
  startYear: number;
  endYear: number | "present";
  barColor: string;
  title: string;
  org: string;
  logoLabel?: string;
  logoSrc?: string;
  logoBackground?: string;
  location?: string;
  description: string;
};

export type CredentialEntry = {
  title: string;
  issuer: string;
  logoSrc?: string;
  logoLabel?: string;
};

export const background = {
  eyebrow: "About",
  title: "Who I Am",
  description:
    "Product direction at Synth and Nexus. Operating systems inside JamBase and with mission-driven teams. The resume has the fuller record.",
  portraitSrc: "/images/about-portrait.jpg",
  portraitAlt: "Sam Loiterstein standing by a waterfront railing",
  about: [
    "I first moved to DC four years ago to study finance and accounting, expecting to follow the usual investment banking or consulting path. After joining the student clubs and, frankly, struggling in the classes, I quickly realized I wanted to build something of my own instead. I co-founded Nexus Consulting and found that I loved listening to people describe the messy, everyday problems their organizations faced. I also learned that I'm drawn to work that gives a mission-driven community a useful tool they can actually put to work.",
    "The part of a project where someone shows me how the work actually gets done, including the workarounds nobody thought to mention is where I thrive. Like a business therapist, its my job to diagnose where the process breaks, and provide technical and strategicsolutions your team can use. I'm especially drawn to wicked problems that impact broad communities.",
    "That interest has taken me from building a student consulting firm to 200+ analysts in the US, Canada, and Europe to building an ever-growing on live music with Synth.",
    'Currently I work on a series of deep machine learning projects at the U.S. Chamber of Commerce Foundation dedicated to "harnessing the power of business for the greater good of America".',
    "Outside of work, I love traveling, reading Buddhist philosophy, and jam bands.",
  ],
  experience: [
    {
      period: "Sept 2026 to Present",
      startYear: 2026,
      endYear: "present",
      barColor: "#003d7c",
      title: "Innovation Scholar",
      org: "U.S. Chamber of Commerce Foundation",
      logoLabel: "CC",
      logoSrc: "/logos/us-chamber-foundation.png",
      description:
        "Research and automation for foundation operations, including AI workflows, data ingestion, and Power Automate processes.",
    },
    {
      period: "Feb 2026 to Present",
      startYear: 2026,
      endYear: "present",
      barColor: "#1a1aff",
      title: "SDR and GTM Engineer",
      org: "JamBase",
      logoLabel: "JB",
      logoSrc: "/logos/jambase.png",
      description:
        "Built the JamBase revenue system across LinkedIn, Apollo, and HubSpot. The work contributed to more than $5 million in attributed sales and more than 200% year-over-year revenue growth on a new product.",
    },
    {
      period: "2025 to Present",
      startYear: 2025,
      endYear: "present",
      barColor: "#ff007f",
      title: "Founder",
      org: "Synth Inc",
      logoLabel: "SY",
      logoSrc: "/logos/synth.png",
      logoBackground: "#000000",
      description:
        "Live music discovery product at getsynth.app. Genre intelligence, including an inspectable feed proof of concept, supports personalized discovery.",
    },
    {
      period: "2024 to Present",
      startYear: 2024,
      endYear: "present",
      barColor: "#0a0a0a",
      title: "Co-Founder and CEO",
      org: "Nexus Consulting",
      logoLabel: "NX",
      logoSrc: "/logos/nexus.png",
      description:
        "Built analyst cohort training, delivery playbooks, and client systems across strategy, operations, and business development.",
    },
    {
      period: "2025",
      startYear: 2025,
      endYear: 2025,
      barColor: "#1b3a6b",
      title: "Revenue Operations Intern",
      org: "SBI, The Growth Advisory",
      logoLabel: "SBI",
      logoSrc: "/logos/sbi.png",
      description:
        "Restructured 13,000+ Salesforce records and reported on $51M+ of pipeline across 6 offerings.",
    },
    {
      period: "2024 to 2025",
      startYear: 2024,
      endYear: 2025,
      barColor: "#5c2d91",
      title: "Movement Building and Operations",
      org: "BBYO",
      logoLabel: "BBYO",
      logoSrc: "/logos/bbyo.png",
      description:
        "At BBYO, I worked for the community building team, prioritizing inclusive programming, member belonging, and creating an incredible experience for 75,000 teens in 75+ countries.",
    },
    {
      period: "2023",
      startYear: 2023,
      endYear: 2023,
      barColor: "#2d5a27",
      title: "Financial Management Intern",
      org: "Federal Reserve Bank of St. Louis",
      logoLabel: "FR",
      logoSrc: "/logos/federal-reserve.png",
      description:
        "Compliance audits for 600+ organizations, a $750K facilities budget, and 1,000+ procurement records.",
    },
  ] satisfies TimelineEntry[],
  education: [
    {
      period: "2023 to 2027",
      startYear: 2023,
      endYear: 2027,
      barColor: "#002856",
      title: "BS, Business Analytics, Honors Program, Minor in Buddhist Ethics",
      org: "The George Washington University",
      logoSrc: "/logos/gwu.png",
      description:
        "Analytics, strategy, and operations coursework with founder and consulting communities on campus.",
    },
    {
      period: "2025 to 2026",
      startYear: 2025,
      endYear: 2026,
      barColor: "#0077b6",
      title: "Student in residence AI / Machine Learning",
      org: "Vrije Universiteit Amsterdam",
      logoLabel: "VU",
      logoSrc: "/logos/vu.png",
      description:
        "Complex neural networks and computer science, with applied machine learning research.",
    },
  ] satisfies TimelineEntry[],
  credentialsTitle: "Licenses and certifications",
  credentialsSummary: "16 credentials across Salesforce, HubSpot, Apollo, LinkedIn, Cursor, Lovable, PostgreSQL, Java, Claude, Replit, AWS, CFA Institute, and Federal Reserve data programs.",
  credentials: [
    { title: "LinkedIn Developer", issuer: "LinkedIn", logoSrc: "/logos/linkedin.svg" },
    { title: "Investment Foundations Certificate", issuer: "CFA Institute", logoSrc: "/logos/cfa-institute.svg" },
    { title: "Storytelling with Data", issuer: "Federal Reserve Bank of St. Louis", logoSrc: "/logos/federal-reserve.png" },
    { title: "Using Data Ethically", issuer: "Federal Reserve Bank of St. Louis", logoSrc: "/logos/federal-reserve.png" },
    { title: "Blogging About Data", issuer: "Federal Reserve Bank of St. Louis", logoSrc: "/logos/federal-reserve.png" },
    { title: "FRED Data Blogging", issuer: "Federal Reserve Bank of St. Louis", logoSrc: "/logos/federal-reserve.png" },
    { title: "HubSpot Developer", issuer: "HubSpot", logoSrc: "/logos/hubspot.svg" },
    { title: "Apollo Developer", issuer: "Apollo", logoSrc: "/logos/apollo.png" },
    { title: "Salesforce Developer", issuer: "Salesforce", logoSrc: "/logos/salesforce.svg" },
    { title: "Cursor Developer", issuer: "Cursor", logoSrc: "/logos/cursor.svg" },
    { title: "Lovable Developer", issuer: "Lovable", logoSrc: "/logos/lovable.svg" },
    { title: "PostgreSQL Developer", issuer: "PostgreSQL", logoSrc: "/logos/postgresql.svg" },
    { title: "Java Developer", issuer: "Java", logoSrc: "/logos/java.svg" },
    { title: "Claude Developer", issuer: "Claude", logoSrc: "/logos/claude.svg" },
    { title: "Replit Developer", issuer: "Replit", logoSrc: "/logos/replit.svg" },
    { title: "Cybersecurity", issuer: "AWS", logoSrc: "/logos/aws.svg" },
  ] satisfies CredentialEntry[],
  pdfButtonLabel: "Download Resume PDF",
} as const;

export const relationshipGroups = [
  {
    id: "operating",
    label: "Operating work",
    hint: "Work inside another organization's system.",
    items: [
      { name: "JamBase", logoSrc: "/logos/jambase.png", detail: "Revenue system" },
      { name: "NACS Foundation", logoSrc: "/logos/marquee/nacs-foundation.png", detail: "Partner map" },
      { name: "U.S. Chamber of Commerce Foundation", logoSrc: "/logos/us-chamber-foundation.png", detail: "Innovation Scholar" },
      { name: "SBI", logoSrc: "/logos/sbi.png", detail: "Revenue operations intern" },
      { name: "BBYO", logoSrc: "/logos/bbyo.png", detail: "Convention programming" },
      { name: "Federal Reserve Bank of St. Louis", logoSrc: "/logos/federal-reserve.png", detail: "Financial management intern" },
    ],
  },
  {
    id: "led",
    label: "Organizations I have led",
    hint: "Product direction and delivery from inside the team.",
    items: [
      { name: "Synth", logoSrc: "/logos/synth.png", detail: "Founder" },
      { name: "Nexus Consulting", logoSrc: "/logos/nexus.png", detail: "Co-founder and CEO" },
      { name: "Campus Watch Chronicle", logoSrc: "/logos/campus-watch-chronicle.png", detail: "Founder" },
    ],
  },
  {
    id: "education",
    label: "Education",
    hint: "Degree programs. Certifications are listed below the timeline.",
    items: [
      { name: "The George Washington University", logoSrc: "/logos/gwu.png", detail: "BS, Business Analytics" },
      { name: "Vrije Universiteit Amsterdam", logoSrc: "/logos/vu.png", detail: "Neural networks and machine learning" },
    ],
  },
] as const;

export type LogoFit = "mark" | "wordmark" | "lockup";

export type WorkedWithLogo = {
  name: string;
  logoSrc: string;
  fit: LogoFit;
  invert?: boolean;
  href?: string;
};

export const workedWithSection = {
  label: builtAt.label,
} as const;

function dedupeWorkedWithLogos(logos: WorkedWithLogo[]): WorkedWithLogo[] {
  const seen = new Set<string>();
  return logos.filter((logo) => {
    if (seen.has(logo.logoSrc)) return false;
    seen.add(logo.logoSrc);
    return true;
  });
}

const logoPresentation: Record<string, Pick<WorkedWithLogo, "fit" | "invert" | "href">> = {
  "/logos/marquee/synth.png": { fit: "mark", href: "https://getsynth.app" },
  "/logos/marquee/nexus.png": { fit: "mark", href: "https://nxsconsultants.com" },
  "/logos/marquee/sbi.png": { fit: "lockup", invert: true, href: "https://sbigrowth.com" },
  "/logos/marquee/bbyo.png": { fit: "mark", invert: true, href: "https://bbyo.org" },
  "/logos/marquee/federal-reserve.png": { fit: "lockup", href: "https://www.stlouisfed.org" },
  "/logos/marquee/gwu.png": { fit: "lockup", href: "https://gwu.edu" },
  "/logos/marquee/vu.png": { fit: "lockup", href: "https://vu.nl" },
  "/logos/marquee/jambase-wordmark.png": { fit: "lockup", href: "https://www.jambase.com" },
  "/logos/marquee/il-piatto.png": { fit: "lockup", href: "https://www.ilpiattodc.com" },
  "/logos/marquee/minnowtech.png": { fit: "wordmark", href: "https://minnowtech.com" },
  "/logos/marquee/stall-plus.png": { fit: "mark", invert: true, href: "https://stallplus.com" },
  "/logos/marquee/campus-watch-chronicle.png": {
    fit: "lockup",
    href: "https://www.linkedin.com/company/campus-watch-chronicle/",
  },
  "/logos/marquee/nacs-foundation.png": { fit: "wordmark", href: "https://www.conveniencecares.org" },
  "/logos/marquee/us-chamber-foundation.png": {
    fit: "lockup",
    href: "https://www.uschamberfoundation.org",
  },
  "/logos/marquee/solutions-atoz.png": { fit: "mark", href: "https://solutionsatoz.com" },
};

function marqueeSrc(src: string): string {
  return src.replace("/logos/", "/logos/marquee/");
}

export const workedWithLogos: WorkedWithLogo[] = dedupeWorkedWithLogos([
  ...background.experience
    .filter((entry) => entry.logoSrc && entry.logoSrc !== "/logos/jambase.png")
    .map((entry) => {
      const logoSrc = marqueeSrc(entry.logoSrc!);
      return {
        name: entry.org,
        logoSrc,
        ...(logoPresentation[logoSrc] ?? { fit: "lockup" as const }),
      };
    }),
  ...background.education
    .filter((entry) => entry.logoSrc)
    .map((entry) => {
      const logoSrc = marqueeSrc(entry.logoSrc!);
      return {
        name: entry.org,
        logoSrc,
        ...(logoPresentation[logoSrc] ?? { fit: "lockup" as const }),
      };
    }),
  {
    name: "JamBase",
    logoSrc: "/logos/marquee/jambase-wordmark.png",
    ...logoPresentation["/logos/marquee/jambase-wordmark.png"],
  },
  {
    name: "Il Piatto DC",
    logoSrc: "/logos/marquee/il-piatto.png",
    ...logoPresentation["/logos/marquee/il-piatto.png"],
  },
  {
    name: "Minnowtech",
    logoSrc: "/logos/marquee/minnowtech.png",
    ...logoPresentation["/logos/marquee/minnowtech.png"],
  },
  {
    name: "Stall Plus",
    logoSrc: "/logos/marquee/stall-plus.png",
    ...logoPresentation["/logos/marquee/stall-plus.png"],
  },
  {
    name: "Campus Watch Chronicle",
    logoSrc: "/logos/marquee/campus-watch-chronicle.png",
    ...logoPresentation["/logos/marquee/campus-watch-chronicle.png"],
  },
  {
    name: "NACS Foundation",
    logoSrc: "/logos/marquee/nacs-foundation.png",
    ...logoPresentation["/logos/marquee/nacs-foundation.png"],
  },
  {
    name: "ATOZ Solutions",
    logoSrc: "/logos/marquee/solutions-atoz.png",
    ...logoPresentation["/logos/marquee/solutions-atoz.png"],
  },
]);

// Work systems

export type CaseStudyStat = {
  value: string;
  label: string;
};

export type WorkSystemBrand = {
  accent: string;
  accentMuted: string;
  surface: string;
  border: string;
  tagBg: string;
  tagText: string;
  logoBackground?: string;
};

export type DemoKind = "interactive" | "live-product" | "narrative";

export type HomepageTier = "selected" | "index";

export type HomepageGroup = "buyer" | "founder-work" | "fractional-expertise" | "record";

export type CaseNarrative = {
  problem: string;
  owned: string;
  built: string;
  usage: string;
  result: string;
  status: string;
};

export type SystemCompetency =
  | "product-community"
  | "revenue-operations"
  | "organization-operations"
  | "data-ai"
  | "research-communication"
  | "media-community";

export type ProofType =
  | "live-product"
  | "interactive-demo"
  | "case-study"
  | "article"
  | "research"
  | "external-project";

export type HomepagePlacement = {
  tier: HomepageTier;
  group?: HomepageGroup;
  order: number;
  competency: SystemCompetency;
  competencyLabel: string;
  proofType: ProofType;
  proofLabel: string;
  displayTitle?: string;
  cardDescription: string;
  resultLine?: string;
  statusLabel?: string;
  displayTags: string[];
  secondaryProofType?: ProofType;
  secondaryProofLabel?: string;
};

export type WorkSystem = {
  slug: string;
  title: string;
  year: string;
  description: string;
  stakes: string;
  brief: string;
  problem: string;
  approach: string;
  outcome: string;
  constraints?: string;
  stack: string[];
  tags: string[];
  liveUrl?: string;
  caseStudyPath?: string;
  logoSrc?: string;
  logoAlt?: string;
  previewSrc?: string;
  previewAlt?: string;
  caseStudyImages?: { src: string; alt: string; caption?: string }[];
  stats?: CaseStudyStat[];
  demo?: { kind: DemoKind; component: string };
  brand: WorkSystemBrand;
  homepage: HomepagePlacement;
  narrative?: CaseNarrative;
  drawerSections?: { heading: string; bullets: string[] }[];
};

export type ProblemPrompt = {
  id: string;
  label: string;
  workSlug: string;
};

export const workSection = {
  eyebrow: "Work",
  title: "Selected work",
  description: "A sales system, a live program map, and an internal workflow. Diagrams and the full record live in the cases.",
  alsoLabel: "More work",
  problemPickerLabel: "What are you working through?",
  briefToggleShow: "Executive brief",
  briefToggleHide: "Full case",
} as const;

export type PortfolioTabId = "founder" | "fractional" | "projects" | "git";

export const portfolioTabs: { id: PortfolioTabId; label: string }[] = [
  { id: "founder", label: "Founder work" },
  { id: "projects", label: "Research" },
  { id: "git", label: "GitHub" },
];

export const founderWorkSection = {
  title: "Founder Work",
} as const;

export const fractionalExpertiseSection = {
  title: "Fractional / Intern Experience",
  description: "Internships and scoped operating roles inside other organizations.",
} as const;

export const systemIndexSection = {
  title: "Research",
  description: "Research and experiments. These are not client revenue results.",
} as const;

export const gitSection = {
  title: "Straight from GitHub",
  description: "Public repositories, loaded from GitHub.",
  profileLabel: "View GitHub profile",
  empty: "Public repositories are unavailable right now.",
  loading: "Loading repositories.",
} as const;

export const engagementsSection = {
  eyebrow: "Offer",
  description: "Three operating problems. AI shows up inside the workflow when the work calls for it.",
} as const;

export const waysToWork = {
  eyebrow: "Engagements",
  title: "How we could work together",
  description: "You own 100% of the work.",
  modes: [
    {
      index: "01",
      kicker: "Defined project",
      title: "Custom product build",
      bestWhen:
        "Your business needs software that existing tools can't deliver, without the cost and commitment of hiring a product team or development studio.",
      whatIDo:
        "I take your business requirements from concept to working software, handling product strategy, design, development and deployment.",
      outcomesLabel: "You get",
      outcomes: ["Purpose-built software", "Direct execution", "Full ownership"],
      cta: "Discuss a build",
      intent: "custom",
      tone: "build",
    },
    {
      index: "02",
      kicker: "Monthly retainer",
      title: "Fractional operating partner",
      bestWhen:
        "Your company is growing faster than your team can execute, and leadership needs additional capacity without adding permanent headcount.",
      whatIDo:
        "I work directly with your CEO/President, CRO, or COO to own and execute critical initiatives across fundraising, go-to-market and operational efficiency.",
      outcomesLabel: "Areas of expertise",
      outcomes: ["Fundraising", "Go-to-market", "Operational efficiency"],
      cta: "Start a retainer",
      intent: "sales",
      tone: "retainer",
    },
    {
      index: "03",
      kicker: "Focused sprint",
      title: "Rapid prototyping",
      bestWhen:
        "You want to explore what custom software could do without committing significant time or capital to a full build.",
      whatIDo:
        "I turn ideas, business problems and workflow challenges into functional prototypes through a short, low-cost engagement.",
      outcomesLabel: "You get",
      outcomes: ["Working proof of concept", "Rapid validation", "Clear path to development"],
      cta: "Scope a sprint",
      intent: "custom",
      tone: "sprint",
    },
  ],
} as const;

export const buildFlow = {
  title: "My typical engagement process:",
  description:
    "We plan your scope, cycle through building, feedback, and improvement with you, and then monitor the product that is yours.",
  hint: "hover over a phase to learn more",
  phases: [
    {
      id: "plan",
      index: "01",
      label: "Plan",
      summary: "Define what we're building for you, and why.",
      steps: [
        "Establish your objectives and success criteria.",
        "Define your project scope and functional requirements.",
        "Map your journeys, workflows, and data dependencies.",
        "Establish your product design and technical architecture.",
        "Prioritize what we build for you first.",
      ],
      outcome: "A clear scope and development plan that is yours.",
    },
    {
      id: "build",
      index: "02",
      label: "Build",
      summary: "Get working software into your hands as quickly as possible.",
      steps: [
        "Develop your minimum viable product (MVP).",
        "Build your core functionality and integrations.",
        "Connect your data sources and existing systems.",
        "Test the work with you and deploy a working product.",
      ],
      outcome: "Functional software that addresses your core need.",
    },
    {
      id: "review",
      index: "03",
      label: "Review",
      summary: "Use your feedback to determine what we build next.",
      steps: [
        "Collect feedback from you and your team.",
        "Evaluate performance against your objectives.",
        "Identify gaps in what you can do with the product.",
        "Reassess requirements based on how you use the product.",
        "Prioritize your next development cycle with us.",
      ],
      outcome: "Development priorities based on your real use.",
    },
    {
      id: "iterate",
      index: "04",
      label: "Iterate",
      summary: "Repeat the build and review cycle until the product meets your need.",
      steps: [
        "Refine the functionality you already have.",
        "Develop the additional features you need.",
        "Release incremental improvements to you.",
        "Keep validating decisions with you.",
        "Expand the product as you see the value.",
      ],
      outcome: "A mature product shaped by your use.",
    },
    {
      id: "optimize",
      index: "05",
      label: "Optimize and analyze",
      summary: "Maintain performance and improve the product as your needs evolve.",
      steps: [
        "Monitor your adoption, and how the product performs.",
        "Resolve bugs and technical issues for you.",
        "Find where automation can save you time.",
        "Keep documentation so your team can run the product.",
        "Introduce targeted improvements as you need them.",
      ],
      outcome: "A sustainable product that is yours, and that you can keep developing.",
    },
  ],
} as const;

export function systemDisplayTitle(system: WorkSystem): string {
  return system.homepage.displayTitle ?? system.title;
}

export const problemPrompts: ProblemPrompt[] = [
  { id: "pipeline", label: "Pipeline numbers I cannot trust", workSlug: "revops-classification" },
  { id: "crm", label: "Outbound and CRM live in different worlds", workSlug: "jambase-sdr" },
  { id: "ml", label: "Discovery product needs ML that ships", workSlug: "genre-intelligence" },
  { id: "capacity", label: "Need consulting capacity without hiring a team", workSlug: "nexus" },
];

export const workSystems: WorkSystem[] = [
  {
    slug: "synth",
    title: "Synth",
    year: "2025",
    description: "Live music discovery and fan connection platform.",
    stakes: "The live experience stops at the ticket purchase and friends rarely coordinate around the same show.",
    brief:
      "I am building a mobile-first community for concert discovery and shared nights out. A genre intelligence pipeline powers personalized feeds at getsynth.app.",
    problem:
      "Concert discovery is fragmented. Friends rarely coordinate around the same shows, and the live experience stops at the ticket purchase.",
    approach:
      "Mobile-first community for finding shows, matching with friends going to the same events, and sharing the experience from discovery through encore.",
    outcome:
      "Synth is live at getsynth.app. Personalized discovery draws on the genre intelligence work, including an inspectable feed proof of concept.",
    constraints: "Consumer trust and feed quality depend on metadata pipelines that stay explainable as volume grows.",
    stack: ["React Native", "Python", "SQL", "ML", "Product"],
    tags: ["Product", "Consumer", "Music", "Mobile"],
    liveUrl: "https://getsynth.app",
    logoSrc: "/logos/synth.png",
    logoAlt: "Synth logo",
    stats: [
      { value: "2025", label: "Founded" },
      { value: "Live", label: "getsynth.app" },
    ],
    homepage: {
      tier: "selected",
      group: "founder-work",
      order: 1,
      competency: "product-community",
      competencyLabel: "Product and community",
      proofType: "live-product",
      proofLabel: "Visit Synth",
      cardDescription:
        "I founded Synth to help live music fans discover shows, connect with other fans, and share their experiences.",
      displayTags: ["Product", "Consumer", "Music", "Mobile"],
    },
    brand: {
      accent: "#ff007f",
      accentMuted: "#ffe5f0",
      surface: "#fff8fb",
      border: "#ffc2dc",
      tagBg: "#ffe5f0",
      tagText: "#9d0049",
      logoBackground: "#000000",
    },
  },
  {
    slug: "jambase-sdr",
    title: "JamBase Revenue System",
    year: "2026",
    description: "Integrated sales environment across LinkedIn, Apollo, and HubSpot.",
    stakes: "Research, outbound, CRM updates, and forecast visibility were split across capable tools.",
    brief:
      "I built one operating workspace for JamBase: accounts, signals, sequences, and RevOps reporting with live HubSpot sync and AI-assisted signal classification.",
    problem:
      "LinkedIn, Apollo, and HubSpot were capable tools. Research, account context, outbound execution, CRM management, signals, and forecasting were fragmented across them.",
    approach:
      "I built an integrated operating environment with AI-assisted signal classification and human review, connected to live HubSpot data.",
    outcome:
      "The team uses one workspace for account research, outreach, CRM updates, and manager visibility. The work contributed to more than $5 million in attributed sales and more than 200% year-over-year revenue growth on a new product.",
    constraints: "Forecast visibility required live CRM sync, reviewer feedback on AI classifications, and brand-safe outbound assets.",
    stack: ["HubSpot", "Apollo", "LinkedIn", "TypeScript", "RevOps"],
    tags: ["RevOps", "HubSpot", "Apollo", "LinkedIn"],
    liveUrl: "https://data.jambase.com",
    caseStudyPath: "/case-studies/jambase-revenue-system.html",
    logoSrc: "/logos/jambase.png",
    logoAlt: "JamBase logo",
    previewSrc: "/images/jambase-revenue-steps.jpg",
    previewAlt: "Five steps of the JamBase revenue system: research, execute, enable, audit, and improve",
    caseStudyImages: [
      {
        src: "/images/jambase-sdr-workflows.png",
        alt: "SDRBase workflows diagram for JamBase sales, marketing, RevOps, and customer intelligence",
        caption: "SDRBase workflows across sales, marketing, RevOps, and customer intelligence.",
      },
      {
        src: "/images/jambase-sdr-flywheel.png",
        alt: "SDRBase prospecting flywheel showing signal-to-pipeline automation",
        caption: "Prospecting flywheel from signals and enrichment through outreach and CRM feedback.",
      },
    ],
    stats: [
      { value: "12", label: "Integrated modules" },
      { value: "1", label: "Unified sales motion" },
    ],
    homepage: {
      tier: "selected",
      group: "buyer",
      order: 1,
      competency: "revenue-operations",
      competencyLabel: "Revenue execution",
      proofType: "case-study",
      proofLabel: "Read the case",
      displayTitle: "JamBase Revenue System",
      cardDescription:
        "As an SDR at JamBase, I use AI to build GTM workflows that connect account signals, research, outreach, and CRM activity.",
      statusLabel: "Shipped",
      displayTags: ["Revenue", "HubSpot", "Apollo", "LinkedIn"],
    },
    narrative: {
      problem:
        "LinkedIn, Apollo, and HubSpot were capable tools. Research, account context, outbound execution, CRM management, signals, and forecasting were fragmented across them.",
      owned:
        "I owned the operating environment: how those tools connected, where AI classified signals, and where a person reviewed the result before it moved work forward.",
      built:
        "An integrated workspace for accounts, contacts, sequences, signals, and RevOps reporting, with live HubSpot sync and AI-assisted signal classification.",
      usage:
        "The team uses it to research accounts, run outreach, update CRM records, and see pipeline and forecast activity in one place.",
      result:
        "The work contributed to more than $5 million in attributed sales and more than 200% year-over-year revenue growth on a new product. The software is one part of that sales motion.",
      status: "Shipped system",
    },
    drawerSections: [
      {
        heading: "System architecture",
        bullets: [
          "React and Vite frontend with TanStack Query and shadcn/ui components",
          "Express API with Drizzle ORM over Postgres",
          "OpenAPI-generated typed hooks and Zod validation",
          "Core tabs: Accounts, Contacts, Sequences, Signals, News Signals, Parking Lot, RevOps",
        ],
      },
      {
        heading: "AI and automation",
        bullets: [
          "News Signals pipeline classifies RSS and pasted content into deal-relevant categories",
          "LLM-assisted enrichment for outbound prioritization",
          "Reviewer override feedback loops to improve classification over time",
        ],
      },
    ],
    brand: {
      accent: "#1e3a5f",
      accentMuted: "#e8eef5",
      surface: "#f7f9fc",
      border: "#c5d4e8",
      tagBg: "#e8eef5",
      tagText: "#1e3a5f",
      logoBackground: "#1e3a5f",
    },
  },
  {
    slug: "nexus",
    title: "Nexus Consulting",
    year: "2024",
    description: "Student-powered consulting firm scaled into a multi-client operating organization.",
    stakes: "Early teams need structured capacity without hiring a full internal bench.",
    brief:
      "I co-founded Nexus and built analyst cohort training, delivery playbooks, and client systems that turned four founders into a repeatable consulting operation.",
    problem:
      "Campus teams and early stage companies need structured consulting capacity without building a full internal team.",
    approach:
      "Recruited and trained analyst cohorts, built delivery playbooks, and ran client engagements across strategy, operations, and business development.",
    outcome:
      "Repeatable project systems across strategy, operations, and business development engagements.",
    constraints: "Quality control and training rails had to scale faster than any single partner could review work manually.",
    stack: ["Consulting", "Operations", "GTM", "Client delivery"],
    tags: ["Consulting", "Operations", "Growth"],
    liveUrl: "https://nxsconsultants.com",
    logoSrc: "/logos/nexus.png",
    logoAlt: "Nexus Consulting logo",
    stats: [
      { value: "200+", label: "Analysts trained" },
      { value: "20+", label: "Clients served" },
    ],
    homepage: {
      tier: "selected",
      group: "founder-work",
      order: 2,
      competency: "organization-operations",
      competencyLabel: "Organization and operations",
      proofType: "external-project",
      proofLabel: "Visit Nexus",
      cardDescription:
        "I co-founded and grew Nexus Consulting to 200+ analysts serving 20+ clients, building the training and delivery systems behind the team.",
      displayTags: ["Consulting", "Operations", "Growth", "Training"],
    },
    brand: {
      accent: "#0a0a0a",
      accentMuted: "#f5f5f5",
      surface: "#fafafa",
      border: "#e5e5e5",
      tagBg: "#f0f0f0",
      tagText: "#262626",
      logoBackground: "#ffffff",
    },
  },
  {
    slug: "genre-intelligence",
    title: "Genre Intelligence Engine",
    year: "2025",
    description: "Two stage mining pipeline for artist and event metadata.",
    stakes: "Recommendation quality collapses when genre labels are noisy and inconsistent across sources.",
    brief:
      "I built a two-stage pipeline that cleans metadata before mining co-occurrence, taxonomies, and embeddings for feed ranking at live music scale.",
    problem:
      "Genre labels in live music data are noisy, incomplete, and inconsistent across sources.",
    approach:
      "Two stage pipeline: clean and normalize signals, then build taxonomies, embeddings, and cluster affinity for feed ranking.",
    outcome:
      "Taxonomies, embeddings, cluster keys, and an inspectable personalized feed proof of concept. This is product and data proof, not a revenue result.",
    constraints: "Explainability mattered: taxonomy paths and cluster keys had to be inspectable by product and ops teams.",
    stack: ["Python", "SQL", "ML", "R"],
    tags: ["Python", "SQL", "ML", "AI"],
    caseStudyPath: "/case-studies/genre-intelligence-engine.html",
    homepage: {
      tier: "selected",
      group: "buyer",
      order: 5,
      competency: "data-ai",
      competencyLabel: "Product and data",
      proofType: "case-study",
      proofLabel: "Read the case",
      cardDescription:
        "I built a proof of concept that turns inconsistent genre labels into taxonomies, embeddings, and a discovery feed people can review.",
      statusLabel: "Proof of concept",
      displayTags: ["Data", "Taxonomy", "Recommendations"],
    },
    narrative: {
      problem: "Noisy, incomplete genre labels limited discovery and recommendation quality.",
      owned: "I built the cleaning pipeline, the taxonomy and embedding outputs, and the inspectable feed proof of concept.",
      built:
        "A two-stage pipeline that normalizes metadata, then produces taxonomy paths, embeddings, clusters, and a ranked personalized feed.",
      usage: "A product or data reviewer can inspect why an item was grouped or ranked.",
      result: "The output is product and data proof. It is not a measured revenue result.",
      status: "Proof of concept",
    },
    drawerSections: [
      {
        heading: "Outputs",
        bullets: [
          "Genre taxonomy paths and cluster keys for explainable grouping",
          "Event clusters and artist embedding clusters for recommendation candidates",
          "User preference and affinity outputs for personalization",
        ],
      },
    ],
    brand: {
      accent: "#ff007f",
      accentMuted: "#ffe5f0",
      surface: "#fff8fb",
      border: "#ffc2dc",
      tagBg: "#ffe5f0",
      tagText: "#9d0049",
      logoBackground: "#000000",
    },
  },
  {
    slug: "revops-classification",
    title: "Revenue Operations Classification",
    year: "2025",
    description: "Classification, scoring recommendations, and operating guidance for pipeline behavior.",
    stakes: "CRM stages and pipeline data did not show deal behavior or where a manager should step in.",
    brief:
      "I mapped win and loss signals to probability tiers and wrote scoring recommendations and operating guidance for managers.",
    problem:
      "CRM stages and pipeline data did not clearly show deal behavior or where managers should intervene.",
    approach:
      "I developed classification, scoring recommendations, and operating guidance from win and loss behavior, segment conversion, and stage friction.",
    outcome:
      "The published case describes impact direction: clearer segment focus, score-based prioritization, and manager intervention points. It does not report a measured revenue lift.",
    constraints: "Scoring had to be legible to managers for intervention on stalled deals, not only for executive roll-ups.",
    stack: ["Analytics", "JavaScript", "TypeScript", "RevOps"],
    tags: ["Analytics", "JavaScript", "TypeScript", "RevOps"],
    caseStudyPath: "/case-studies/indiagrowthcorp-revops-analytics.html",
    homepage: {
      tier: "selected",
      group: "buyer",
      order: 4,
      competency: "revenue-operations",
      competencyLabel: "Revenue execution",
      proofType: "case-study",
      proofLabel: "Read the case",
      cardDescription:
        "I analyzed CRM deal behavior and developed scoring recommendations to help managers decide where to intervene.",
      statusLabel: "Recommendations",
      displayTags: ["Pipeline", "Scoring", "Forecasting"],
    },
    narrative: {
      problem: "CRM stages and pipeline data did not clearly show deal behavior or where managers should intervene.",
      owned: "I developed the classification, the scoring recommendations, and the operating guidance.",
      built:
        "A framework that maps win and loss signals to probability tiers, with views for product lines and playbooks for stalled or iteration-heavy deals.",
      usage:
        "Managers can use the scores to decide which opportunities need intervention, and teams can use the guidance for enablement planning.",
      result:
        "The published case describes the direction of impact. A measured revenue lift is not part of the record.",
      status: "Recommendations and operating guidance",
    },
    brand: {
      accent: "#1b3a6b",
      accentMuted: "#e8eef5",
      surface: "#f7f9fc",
      border: "#c5d4e8",
      tagBg: "#e8eef5",
      tagText: "#1b3a6b",
    },
  },
  {
    slug: "linkedin-voice",
    title: "Enterprise LinkedIn Voice + Analytics",
    year: "2025",
    description: "Architecture for AI-assisted LinkedIn publishing with voice controls, approvals, and analytics.",
    stakes: "Teams needed publishing help that kept each author's voice, a review step, and a view of performance.",
    brief:
      "I designed a multi-tenant publishing architecture with voice fingerprinting, approval workflows, and team analytics.",
    problem:
      "Teams needed AI-assisted publishing that preserved individual voice, approval controls, and performance visibility.",
    approach:
      "I designed the architecture: voice fingerprinting from writing samples, role-based review, and analytics for the person, the team, and the sponsor.",
    outcome:
      "The published material describes platform architecture and the metrics a deployment would track. It does not report a live deployment or achieved results.",
    constraints: "Role-based workflows, pre-publish checks, and edit-distance feedback loops were required before any auto-post path went live.",
    stack: ["AI", "Analytics", "JavaScript", "TypeScript"],
    tags: ["AI", "Analytics", "JavaScript", "TypeScript"],
    caseStudyPath: "/case-studies/enterprise-linkedin-voice-analytics.html",
    homepage: {
      tier: "selected",
      group: "buyer",
      order: 2,
      competency: "data-ai",
      competencyLabel: "AI inside operations",
      proofType: "case-study",
      proofLabel: "Read the case",
      cardDescription:
        "I designed an AI-assisted publishing system to draft in each author's voice, require approval, and track performance.",
      statusLabel: "Architecture",
      displayTags: ["AI", "Approvals", "Analytics"],
    },
    narrative: {
      problem:
        "Teams needed AI-assisted publishing that preserved individual voice, approval controls, and performance visibility.",
      owned:
        "I designed the platform architecture: voice controls, the approval path, and the analytics layers.",
      built:
        "A multi-tenant design for drafting from a voice fingerprint, routing posts through review, and reporting engagement by person and team.",
      usage:
        "The intended path is draft, review, approve, then schedule. The published case does not document a team running that path in production.",
      result:
        "Engagement rate, follower growth, posts per user, approval rate, and pipeline attribution are intended measures. They are not reported outcomes.",
      status: "Architecture",
    },
    drawerSections: [
      {
        heading: "Enterprise controls",
        bullets: [
          "Role-based workflows for Admin, Manager, User, and Viewer roles",
          "Draft, review, approve, schedule, and auto-post options per team policy",
          "Multi-tenant branding configuration for domain and client-specific UI",
        ],
      },
      {
        heading: "AI quality controls",
        bullets: [
          "Voice fingerprinting from writing samples to preserve pacing and structure",
          "Repetition, plagiarism, and tone consistency checks before publish",
          "Engagement feedback loops to improve draft quality over time",
        ],
      },
    ],
    brand: {
      accent: "#324f3c",
      accentMuted: "#e3ece4",
      surface: "#f3f7f4",
      border: "#c6d8c9",
      tagBg: "#e3ece4",
      tagText: "#2a4032",
    },
  },
  {
    slug: "campus-watch",
    title: "Campus Watch Chronicle",
    year: "2024",
    description: "Horology blog for entry-level collectors seeking financially accessible timepieces.",
    stakes: "Entry-level collectors leave when guidance feels generic or priced out of reach.",
    brief:
      "I launched a college-focused editorial system with SEO structure and syndication to Quill and Pad for accessible collector guidance.",
    problem:
      "Entry-level watch collectors lack curated guidance on high quality pieces below luxury price points.",
    approach:
      "College-focused blog with SEO-driven content, social distribution, and syndication to Quill and Pad.",
    outcome:
      "Grew to 1,700+ readers and followers with syndicated publication on accessible collector options under $250.",
    stack: ["Writing", "SEO", "Social", "Editorial"],
    tags: ["Media", "Writing", "Horology"],
    liveUrl: "https://www.linkedin.com/company/campus-watch-chronicle/",
    logoSrc: "/logos/campus-watch-chronicle.png",
    logoAlt: "Campus Watch Chronicle logo",
    homepage: {
      tier: "selected",
      group: "founder-work",
      order: 3,
      competency: "media-community",
      competencyLabel: "Media and publishing",
      proofType: "external-project",
      proofLabel: "Visit LinkedIn",
      cardDescription:
        "I founded Campus Watch Chronicle to write about affordable horology, from accessible watches to the business and culture of watchmaking, with work syndicated to Quill and Pad.",
      displayTags: ["Media", "Writing", "SEO"],
    },
    brand: {
      accent: "#002856",
      accentMuted: "#e8eef5",
      surface: "#f7f9fc",
      border: "#c5d4e8",
      tagBg: "#e8eef5",
      tagText: "#002856",
      logoBackground: "#ffffff",
    },
  },
  {
    slug: "bbyo-conventions",
    title: "BBYO convention and movement programming",
    year: "2024",
    description: "Regional convention coordination and summer leadership programming.",
    stakes: "Three hundred teens arrive with one schedule and last-minute changes every hour.",
    brief:
      "I coordinated regional conventions and summer programming with team-based structures designed for onboarding and logistics resilience.",
    problem:
      "Bring 300+ teens into one cohesive convention experience while adapting to last-minute logistics changes.",
    approach:
      "Team-based Maccabiah programming, steering committee structure, and separates sessions designed for new member onboarding.",
    outcome:
      "Exceeded a 325 attendee convention goal with summer programming across 29 countries.",
    stack: ["Community", "Events", "Leadership"],
    tags: ["Community", "Events", "Leadership"],
    logoSrc: "/logos/bbyo.png",
    logoAlt: "BBYO logo",
    homepage: {
      tier: "selected",
      group: "record",
      order: 5,
      competency: "organization-operations",
      competencyLabel: "Community and events",
      proofType: "case-study",
      proofLabel: "View the project",
      displayTitle: "BBYO",
      cardDescription:
        "At BBYO, I worked for the community building team, prioritizing inclusive programming, member belonging, and creating an incredible experience for 75,000 teens in 75+ countries.",
      displayTags: ["Community", "Events", "Leadership"],
    },
    brand: {
      accent: "#5c2d91",
      accentMuted: "#f0e8f5",
      surface: "#faf8fc",
      border: "#d4c5e8",
      tagBg: "#f0e8f5",
      tagText: "#5c2d91",
      logoBackground: "#ffffff",
    },
  },
  {
    slug: "chamber-foundation",
    title: "Innovation Scholar",
    year: "2026",
    description: "Research and automation for U.S. Chamber of Commerce Foundation programs.",
    stakes: "Foundation programs need research and operating tools that staff can run.",
    brief:
      "I research and apply AI and automation to foundation operations, including data-ingestion workflows, Power Automate processes, and program tools for stakeholder engagement.",
    problem:
      "Internal operations and external programs needed research, data ingestion, and reporting that staff could run.",
    approach:
      "I built research, data-ingestion, and reporting workflows, including Power Automate processes and tools for stakeholder engagement.",
    outcome:
      "Operating workflows for foundation programs, with AI and automation applied where the process calls for them.",
    stack: ["Power Automate", "AI", "Data", "Reporting"],
    tags: ["AI", "Automation", "Research"],
    liveUrl: "https://www.uschamberfoundation.org",
    logoSrc: "/logos/us-chamber-foundation.png",
    logoAlt: "U.S. Chamber of Commerce Foundation logo",
    homepage: {
      tier: "index",
      group: "record",
      order: 1,
      competency: "data-ai",
      competencyLabel: "Research and automation",
      proofType: "external-project",
      proofLabel: "Visit foundation",
      displayTitle: "U.S. Chamber of Commerce Foundation",
      cardDescription:
        "As an Innovation Scholar, I research and prototype AI and automation workflows for data ingestion, reporting, and Foundation programs.",
      displayTags: ["AI", "Power Automate", "Research"],
    },
    brand: {
      accent: "#003d7c",
      accentMuted: "#e6eef6",
      surface: "#f5f8fb",
      border: "#c5d5e6",
      tagBg: "#e6eef6",
      tagText: "#003d7c",
      logoBackground: "#ffffff",
    },
  },
  {
    slug: "sbi-revops",
    title: "Revenue Operations Intern",
    year: "2025",
    description: "Salesforce hygiene and pipeline reporting at SBI, The Growth Advisory.",
    stakes: "Forecast meetings fail when the CRM no longer describes the accounts and personas in market.",
    brief:
      "I restructured 13,000+ Salesforce contacts, accounts, and personas, and reported weekly, quarterly, and annual forecasts across 6 offerings.",
    problem:
      "Salesforce contacts, accounts, and personas were too noisy to support accurate forecasts.",
    approach:
      "I cleaned and restructured the CRM with web research and ZoomInfo, then reported pipeline health, bookings, and revenue to firm leadership.",
    outcome:
      "CRM accuracy above 95%, with reporting on $51M+ of pipeline across 6 offerings.",
    stack: ["Salesforce", "ZoomInfo", "RevOps", "Forecasting"],
    tags: ["Salesforce", "RevOps", "Forecasting"],
    liveUrl: "https://sbigrowth.com",
    logoSrc: "/logos/sbi.png",
    logoAlt: "SBI logo",
    homepage: {
      tier: "index",
      group: "record",
      order: 4,
      competency: "revenue-operations",
      competencyLabel: "Revenue operations",
      proofType: "external-project",
      proofLabel: "Visit SBI",
      displayTitle: "SBI, The Growth Advisory",
      cardDescription:
        "At SBI, I restructured 13,000+ Salesforce records and reported on $51M+ of pipeline across six offerings.",
      displayTags: ["Salesforce", "RevOps", "Forecasting"],
    },
    brand: {
      accent: "#1b3a6b",
      accentMuted: "#e8eef5",
      surface: "#f7f9fc",
      border: "#c5d4e8",
      tagBg: "#e8eef5",
      tagText: "#1b3a6b",
      logoBackground: "#ffffff",
    },
  },
  {
    slug: "fed-st-louis",
    title: "Financial Management Intern",
    year: "2023",
    description: "Compliance, budgeting, and procurement reporting at the Federal Reserve Bank of St. Louis.",
    stakes: "Institutional reporting breaks when compliance, facilities spend, and procurement records live apart.",
    brief:
      "I audited compliance for 600+ external organizations and managed a $750K facilities budget and 1,000+ software procurement records.",
    problem:
      "Compliance, facilities spend, and software procurement needed one reporting trail.",
    approach:
      "I audited external organizations, tracked the facilities budget, and maintained procurement records for reporting.",
    outcome:
      "Compliance coverage for 600+ organizations, a $750K facilities budget, and 1,000+ procurement records in the reporting set.",
    stack: ["Compliance", "Budgeting", "Procurement", "Reporting"],
    tags: ["Compliance", "Budgeting", "Reporting"],
    liveUrl: "https://www.stlouisfed.org",
    logoSrc: "/logos/federal-reserve.png",
    logoAlt: "Federal Reserve Bank of St. Louis logo",
    homepage: {
      tier: "index",
      group: "record",
      order: 6,
      competency: "organization-operations",
      competencyLabel: "Finance and compliance",
      proofType: "external-project",
      proofLabel: "Visit St. Louis Fed",
      displayTitle: "Federal Reserve Bank of St. Louis",
      cardDescription:
        "At the St. Louis Fed, I audited compliance for 600+ organizations, supported a $750K facilities budget, and reviewed 1,000+ software procurement records.",
      displayTags: ["Compliance", "Budgeting", "Reporting"],
    },
    brand: {
      accent: "#2d5a27",
      accentMuted: "#e7f0e6",
      surface: "#f6faf6",
      border: "#c5d8c3",
      tagBg: "#e7f0e6",
      tagText: "#2d5a27",
      logoBackground: "#ffffff",
    },
  },
  {
    slug: "partner-map",
    title: "Partner data ingestion and mapping platform",
    year: "2025",
    description: "Mapping platform with ingest workflows, geocoding, and media-kit generation.",
    stakes: "Partner location data arrived in inconsistent formats with no unified map or branding output.",
    brief:
      "I built an Express-based ingest and visualization platform with geocoding, media-kit generation, and optional Supabase persistence for 24/7 response operations.",
    problem:
      "Partner location data arrived in inconsistent formats with no unified map or branding output.",
    approach:
      "Node and Express platform with ingest workflows, geocoding, media-kit generation, and optional Supabase persistence.",
    outcome:
      "A production-oriented build for ingest, mapping, and media kits. The case names open engineering risks. A grant-management outcome is not part of this record.",
    stack: ["JavaScript", "TypeScript", "Python", "SQL"],
    tags: ["JavaScript", "TypeScript", "Python", "SQL"],
    liveUrl: "https://247daymap.conveniencecares.org/",
    caseStudyPath: "/case-studies/nacs-foundation-partner-map.html",
    previewSrc: "/images/nacs-data-to-delivery.png",
    previewAlt:
      "NACS Foundation data flow: messy files are parsed, normalized, geocoded, and reviewed, then delivered as a searchable map and custom media kits.",
    homepage: {
      tier: "selected",
      group: "buyer",
      order: 3,
      competency: "organization-operations",
      competencyLabel: "Program infrastructure",
      proofType: "live-product",
      proofLabel: "Open the map",
      secondaryProofType: "case-study",
      secondaryProofLabel: "Read the case",
      displayTitle: "NACS Foundation partner map",
      cardDescription:
        "I built a system that ingests and normalizes messy partner data across file types, geocodes locations through an external API, and produces a searchable map and media kits.",
      statusLabel: "Live map",
      displayTags: ["Partners", "Map", "Media kits"],
    },
    narrative: {
      problem:
        "A mission-driven team needed partner data ingested, mapped, maintained, and turned into usable program and media outputs.",
      owned:
        "I built the ingest, geocoding, map, and media-kit workflows, and I documented the engineering risks that should be closed before broader use.",
      built:
        "A production-oriented Express app. Staff can upload CSV, spreadsheet, PDF, and document files. The app geocodes locations, draws a map, and generates media kits. Persistence can use Supabase or a local file.",
      usage:
        "Staff upload partner lists, review locations on the map, and produce media materials from the same records.",
      result:
        "The case describes a production-oriented build and names open risks: an unauthenticated delete route, large upload limits, serverless session limits, and any token that is not stored in the environment. A public map URL is linked from this site. A grant-management outcome is not part of this record.",
      status: "Production-oriented build",
    },
    brand: {
      accent: "#3f624a",
      accentMuted: "#e3ece4",
      surface: "#f3f7f4",
      border: "#c6d8c9",
      tagBg: "#e3ece4",
      tagText: "#2a4032",
    },
  },
  {
    slug: "sustainable-ai",
    title: "Sustainable AI Data Centers Research",
    year: "2025",
    description: "Multi-country AI infrastructure study with statistical comparisons.",
    stakes: "Policy claims about AI infrastructure fail without defensible cross-country comparison.",
    brief:
      "I compared AI data center compliance, emissions, and energy demand across four countries with mixed-method analysis and poster-ready visual narratives.",
    problem:
      "Compare AI data center compliance, emissions, and energy demand across countries with defensible statistics.",
    approach:
      "Multi-country research design with statistical comparisons and poster-ready data visualizations.",
    outcome:
      "Presented at GW InnovationFest with compliance, emissions, and energy demand narratives across jurisdictions.",
    stack: ["R", "Python", "Data Viz", "Policy"],
    tags: ["R", "Python", "Data Viz", "Policy"],
    caseStudyPath: "/case-studies/sustainable-ai-data-centers-research.html",
    homepage: {
      tier: "index",
      order: 4,
      competency: "research-communication",
      competencyLabel: "Research and policy",
      proofType: "research",
      proofLabel: "View research",
      cardDescription:
        "I compared data center compliance, emissions, and energy demand across countries through statistical analysis and visualization.",
      displayTags: ["R", "Python", "Policy"],
    },
    brand: {
      accent: "#0077b6",
      accentMuted: "#e8f4fa",
      surface: "#f7fbfd",
      border: "#c5dce8",
      tagBg: "#e8f4fa",
      tagText: "#0077b6",
    },
  },
];

function byHomepageOrder(a: WorkSystem, b: WorkSystem): number {
  return a.homepage.order - b.homepage.order;
}

function byGroup(group: HomepageGroup) {
  return (s: WorkSystem) => s.homepage.tier === "selected" && s.homepage.group === group;
}

export const founderWorkSystems = workSystems.filter(byGroup("founder-work")).sort(byHomepageOrder);

export const fractionalExpertiseSystems = workSystems
  .filter(byGroup("fractional-expertise"))
  .sort(byHomepageOrder);

export const buyerWorkSystems = workSystems.filter(byGroup("buyer")).sort(byHomepageOrder);

export const selectedSystems = buyerWorkSystems;

export type WorkMenuCategory = "Projects" | "Founder work" | "Company roles";

export type WorkMenuItem = {
  slug: string;
  category: WorkMenuCategory;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  external: boolean;
  logoSrc?: string;
  logoBackground?: string;
};

const menuLogoBySlug: Record<string, { logoSrc: string; logoBackground?: string }> = {
  "partner-map": { logoSrc: "/logos/nacs-foundation.png" },
  "genre-intelligence": { logoSrc: "/logos/synth.png", logoBackground: "#000000" },
  "sustainable-ai": { logoSrc: "/logos/gwu.png" },
};

function workMenuItem(slug: string, category: WorkMenuCategory): WorkMenuItem {
  const system = workSystems.find((item) => item.slug === slug);
  if (!system) {
    throw new Error(`Missing work system: ${slug}`);
  }
  const design = system.homepage.statusLabel === "Architecture";
  const href = system.caseStudyPath ?? system.liveUrl ?? (slug === "bbyo-conventions" ? "https://bbyo.org" : "#background");
  const external = href.startsWith("http");
  const linkLabel = system.caseStudyPath
    ? design
      ? "See the design"
      : "Read the case"
    : slug === "bbyo-conventions"
      ? "Visit BBYO"
      : system.homepage.proofLabel;
  const logo = menuLogoBySlug[slug];
  return {
    slug,
    category,
    title: system.homepage.displayTitle ?? system.title,
    description: system.homepage.cardDescription,
    href,
    linkLabel,
    external,
    logoSrc: system.logoSrc ?? logo?.logoSrc,
    logoBackground: system.brand.logoBackground ?? logo?.logoBackground,
  };
}

const projectMenu = [
  "jambase-sdr",
  "partner-map",
  "linkedin-voice",
  "revops-classification",
  "genre-intelligence",
  "sustainable-ai",
].map((slug) => workMenuItem(slug, "Projects"));

const founderMenu = ["synth", "nexus", "campus-watch"].map((slug) => workMenuItem(slug, "Founder work"));

const jambaseRole: WorkMenuItem = {
  slug: "jambase-role",
  category: "Company roles",
  title: "JamBase",
  description:
    "As an SDR at JamBase, I built the revenue system across LinkedIn, Apollo, and HubSpot, contributing to more than $5 million in attributed sales and more than 200% year-over-year revenue growth on a new product.",
  href: "https://www.jambase.com",
  linkLabel: "Visit JamBase",
  external: true,
  logoSrc: "/logos/jambase.png",
};

const roleMenu = [
  jambaseRole,
  ...["chamber-foundation", "sbi-revops", "bbyo-conventions", "fed-st-louis"].map((slug) =>
    workMenuItem(slug, "Company roles"),
  ),
];

export const workMenuGroups = [
  { category: "Projects" as const, items: projectMenu },
  { category: "Founder work" as const, items: founderMenu },
  { category: "Company roles" as const, items: roleMenu },
];

export const workMenuRotation: WorkMenuItem[] = projectMenu.flatMap((item, index) =>
  [item, founderMenu[index], roleMenu[index]].filter((entry): entry is WorkMenuItem => Boolean(entry)),
);

export const systemIndex = workSystems
  .filter((s) => s.homepage.tier === "index" && s.homepage.group !== "record")
  .sort(byHomepageOrder);

/** @deprecated Use systemIndex */
export type EarlierSystem = {
  slug: string;
  title: string;
  year: string;
  description: string;
  challenge: string;
  recommendation: string;
  result: string;
  tags: string[];
  href?: string;
};

/** @deprecated Use systemIndex */
export const earlierSystems: EarlierSystem[] = systemIndex.map((w) => ({
  slug: w.slug,
  title: w.title,
  year: w.year,
  description: w.homepage.cardDescription,
  challenge: w.problem,
  recommendation: w.approach,
  result: w.outcome,
  tags: w.homepage.displayTags,
  href: w.liveUrl ?? w.caseStudyPath,
}));

// Media

export type MediaItem = {
  type: "Article" | "Podcast" | "Mention" | "Interview";
  outlet: string;
  title: string;
  date?: string;
  href?: string;
};

export const mediaSection = {
  eyebrow: "In the press",
  title: "In the press",
  description: "Editorial, research, and civic conversations alongside the writing.",
};

export const media: MediaItem[] = [
  {
    type: "Podcast",
    outlet: "Delegate 2 Elevate",
    title: "97 Sam Loiterstein: Gen Z Founder Energy Meets Real-World Delegation",
    date: "September 27, 2026",
    href: "https://open.spotify.com/episode/5SvrnBGQvqhmeuUo74SiDI",
  },
  {
    type: "Mention",
    outlet: "GW New Venture Competition",
    title: "Nexus Consulting named a 2025 New Venture Competition semifinalist.",
    date: "2025",
    href: "https://newventurecompetition.gwu.edu/2025-new-venture-competition-semifinalist",
  },
  {
    type: "Article",
    outlet: "GW Today",
    title: "InnovationFest showcases the breadth and depth of GW research.",
    date: "May 5, 2025",
    href: "https://gwtoday.gwu.edu/innovationfest-showcases-breadth-and-depth-gw-research",
  },
  {
    type: "Interview",
    outlet: "PBS NewsHour",
    title: "How teens in Missouri are experiencing antisemitism and what they are doing about it.",
    date: "May 22, 2023",
    href: "https://www.pbs.org/newshour/nation/how-missourians-are-combating-antisemitism-in-their-communities",
  },
  {
    type: "Article",
    outlet: "Quill and Pad",
    title: "How Swatch saved the Swiss watch industry.",
    date: "May 18, 2024",
    href: "https://quillandpad.com/2024/05/18/how-swatch-saved-the-swiss-watch-industry/",
  },
  {
    type: "Mention",
    outlet: "St. Louis Jewish Light",
    title: "Sam Loiterstein chosen to speak on Jewish resilience at DC Oct. 7 event.",
    date: "October 7, 2024",
    href: "https://stljewishlight.org/news/news-local/sam-loiterstein-chosen-to-speaks-on-jewish-resilience-at-dc-oct-7-event/",
  },
];

// Services / engagements

export type Service = {
  audience: string;
  title: string;
  problem: string;
  proof: string;
  caseLabel: string;
  caseHref: string;
  cta: string;
  intent: string;
};

export const practiceBridge = {
  eyebrow: "Past Work",
  title: "Here's what my work looks like",
} as const;

export const buildSection = {
  title: "What I build",
  lineLead: "See how this could work at your",
  places: [
    "startup",
    "nonprofit",
    "consultancy",
    "foundation",
    "agency",
    "association",
    "growing company",
    "social enterprise",
    "venture studio",
    "media company",
    "program board",
    "marketing firm",
  ],
  slides: [
    {
      image: "/images/operating-network.png",
      imageAlt:
        "Signal sources feed a CRM and sequencer for research, outreach, and records. Human judgment stays on every decision, and memory from engagement, outcomes, and patterns comes back to improve targeting, timing, and outreach.",
      width: 1024,
      height: 483,
      headline: "Find the right accounts. Book more meetings. Keep your CRM clean and accurate.",
      body: "SDRBase is a custom sales development system that connects HubSpot, Apollo, and LinkedIn so reps can research accounts and run outbound while managers track pipeline and forecast from the same work.",
      linkLabel: "See the JamBase build",
      linkHref: "/case-studies/jambase-revenue-system.html",
    },
    {
      image: "/images/nexconnect-project-hub.png",
      imageAlt:
        "NexConnect project hub connecting RevOps, staffing, work planning, a client portal, invoicing, and reporting.",
      width: 1024,
      height: 581,
      headline: "One project workspace for your firm and its clients.",
      body: "NexConnect is a custom project management system where sales hands off scoped work, teams plan and deliver it, clients follow progress, and finance handles invoicing + reporting.",
      linkLabel: "See the NexConnect build",
      linkHref: "https://nxsconsultants.com",
    },
    {
      image: "/images/nacs-data-to-delivery.png",
      imageAlt:
        "NACS Foundation data flow: messy files are parsed, normalized, geocoded, and reviewed, then delivered as a searchable map and custom media kits.",
      width: 1024,
      height: 503,
      headline: "A map staff and the public can search.",
      body: "I built a system that ingests and normalizes messy partner data across file types, geocodes locations through an external API, and produces a searchable map and media kits.",
      linkLabel: "See the NACS build",
      linkHref: "/case-studies/nacs-foundation-partner-map.html",
    },
  ],
  catalogLabel: "All of the work",
  portfolioCta: "See my whole portfolio and experience",
  ctaLead: "If these problems hit close to home, a custom build might be right for you.",
  cta: "Contact me here",
  ctaIntent: "custom",
} as const;

export const servicesSection = {
  eyebrow: "Offer",
  title: "What I build",
  intro: [] as string[],
  description: "See how this could work at your startup.",
  ctaPrompt: "A different operating problem?",
  ctaSubcopy: "Describe the handoff that is stalling. If I am the wrong person, I will say so.",
  ctaButton: "Discuss a project",
};

export const services: Service[] = [
  {
    audience: "Revenue teams",
    title: "Turn a capable stack into a working sales motion",
    problem:
      "Your team has the CRM, prospecting tools, and account data. I connect the steps between finding an opportunity and acting on it, so reps know who to contact and leaders can see what is happening in the pipeline.",
    proof:
      "At JamBase, I connected signals, research, outreach, and CRM activity across the existing stack. The work contributed to more than $5 million in attributed sales.",
    caseLabel: "See the JamBase work",
    caseHref: "/case-studies/jambase-revenue-system.html",
    cta: "Talk about your revenue system",
    intent: "sales",
  },
  {
    audience: "Operations teams",
    title: "Put AI into work people already own",
    problem:
      "A useful AI workflow needs the right information, a clear decision point, and someone accountable for the result. I build around the process your team already runs, then make the new system practical for them to use and maintain.",
    proof:
      "My publishing system design brings an author's voice, AI drafts, human approval, and performance data into one workflow.",
    caseLabel: "See the workflow design",
    caseHref: "/case-studies/enterprise-linkedin-voice-analytics.html",
    cta: "Talk about an operations problem",
    intent: "ai",
  },
  {
    audience: "Mission-driven teams",
    title: "Make program information usable",
    problem:
      "Program staff need to find accurate partner information, keep it current, and turn it into something the public or funders can use. I build tools around those jobs and the team's budget.",
    proof: "The NACS Foundation's live map lets staff and the public search participating stores.",
    caseLabel: "Open the map",
    caseHref: "https://247daymap.conveniencecares.org/",
    cta: "Talk about a program system",
    intent: "other",
  },
];

// Writing / Substack (SEO: indexable previews; full articles canonical on Substack)

export type InsightEntry = {
  slug: string;
  title: string;
  tag: "Product" | "Operations" | "GTM" | "Strategy";
  date: string;
  published: boolean;
  excerpt?: string;
  body?: string[];
};

export const writingSection = {
  eyebrow: "Press",
  title: "Writing, Podcasts, and Press",
  description:
  "I'm lucky to have been featured in some great podcasts and publications. If you're curious about my own writing, subscribe to my Substack!"
} as const;

export const substack = {
  /** RSS + embed host */
  publicationHost: "sloiterstein.substack.com",
  publicationUrl: "https://sloiterstein.substack.com",
  /** Public profile URL */
  profileUrl: "https://substack.com/@sloiterstein",
  eyebrow: writingSection.eyebrow,
  title: writingSection.title,
  description: writingSection.description,
  notesLabel: "Notes",
  readLabel: "Read on Substack",
  subscribeLabel: "Subscribe on Substack",
  emptyState: "No posts yet",
  loadingMore: "Loading more.",
  feedPath: "/substack-feed.json",
  apiPath: "/api/substack-feed",
  pageSize: 4,
} as const;

/** @deprecated Replaced by Substack feed */
export const insights = {
  eyebrow: substack.eyebrow,
  title: substack.title,
  description: substack.description,
  readLabel: substack.readLabel,
  comingSoonLabel: "Coming soon",
  entries: [] as InsightEntry[],
};

// Contact

export type ContactIntent = {
  id: string;
  label: string;
  placeholder: string;
};

export const contact = {
  eyebrow: "Contact",
  title: "I'd love to hear what you're working on!",
  emailLabel: "Email",
  emailHint: "If you would rather write directly.",
  nextLabel: "What happens next",
  nextBody:
    "I'll read your note and reply personally within 24 hours. If I think I can help, we'll set up a short conversation about what's going on. If not I'll refer you to someone who can!",
  form: {
    intentLabel: "Topic",
    intentDefault: "Select a topic",
    placeholders: {
      name: "Your name",
      email: "you@company.com",
      message: "What resonated, and what's going on at your organization?",
    },
    sendButton: "Send message",
    sendingLabel: "Sending",
    successHeading: "Message sent.",
    successBody: "I have the note. I will reply to set a first conversation.",
    successAction: "Send another message",
    validation: {
      nameRequired: "Please enter your name.",
      emailRequired: "Email is required.",
      emailInvalid: "Please provide a valid email.",
      messageShort: "Add a few more words about the workflow.",
      messageLong: "Message is too long.",
      spam: "Spam detected.",
      generic: "Unable to send right now.",
    },
  },
  intents: [
    {
      id: "sales",
      label: "The sales system caught my eye",
      placeholder: "What resonated, and what's going on at your organization?",
    },
    {
      id: "projects",
      label: "We need a better way to manage projects",
      placeholder: "What resonated, and what's going on at your organization?",
    },
    {
      id: "data",
      label: "Our data is a mess",
      placeholder: "What resonated, and what's going on at your organization?",
    },
    {
      id: "ai",
      label: "We want to make AI work for us",
      placeholder: "What resonated, and what's going on at your organization?",
    },
    {
      id: "custom",
      label: "I have an idea for a custom tool",
      placeholder: "What resonated, and what's going on at your organization?",
    },
    {
      id: "other",
      label: "Something else caught my attention",
      placeholder: "What resonated, and what's going on at your organization?",
    },
  ] satisfies ContactIntent[],
} as const;

// Footer

export const footer = {
  builtNote: "",
  fanLabel: "For real fans:",
  fanLinks: [
    { label: "Library", href: "https://library.sam-loiterstein.com" },
    { label: "Menu", href: "https://menu.sam-loiterstein.com" },
  ],
} as const;

// Legacy exports for gradual migration (deprecated)

export const linkedin = {
  eyebrow: "Connect on LinkedIn",
  name: site.name,
  tagline:
    "Founder at Synth and Co-Founder, CEO at Nexus Consulting. Community, media, analytics, and startups across live music, youth leadership, and RevOps.",
  location: site.location,
  status: "Open to partnerships, operators, and founders",
  photoSrc: "/Headshot.jpeg",
  photoAlt: "Portrait of Sam Loiterstein.",
  buttonLabel: "Open LinkedIn",
  url: site.socials.linkedin,
} as const;

export type Project = {
  title: string;
  year: string;
  description: string;
  challenge?: string;
  recommendation?: string;
  result?: string;
  tags: string[];
  href?: string;
};

export type FeaturedProject = Omit<Project, "challenge" | "recommendation" | "result"> & {
  href: string;
  logoSrc: string;
  logoAlt: string;
  problem: string;
  approach: string;
  stack: string[];
  outcome: string;
  stats?: CaseStudyStat[];
  brand: WorkSystemBrand;
};

/** @deprecated Use background */
export const resume = background;

/** @deprecated Use approach */
export const about = {
  ...approach,
  builtAt,
  title: approach.title,
  bioParagraphs: [approach.manifesto],
  narrativeThreads: threads.map((t) => ({ title: t.title, body: t.body })),
  headshot: {
    sources: [
      "/images/about-headshot.jpg",
      "/images/about-headshot-tight.jpg",
      "/Headshot.jpeg",
      "/headshot.jpeg",
      "/Headshot.jpg",
      "/headshot.jpg",
      "/Headshot.JPG",
      "/Headshot.JPEG",
    ],
    alt: "Sam Loiterstein headshot",
    caption: "Sam Loiterstein, Washington, DC",
  },
};

/** @deprecated Use selectedSystems */
export const featuredProjects = selectedSystems.map((w) => ({
  title: systemDisplayTitle(w),
  year: w.year,
  description: w.homepage.cardDescription,
  problem: w.problem,
  approach: w.approach,
  stack: w.stack,
  outcome: w.outcome,
  stats: w.stats,
  tags: w.homepage.displayTags,
  href: w.liveUrl ?? w.caseStudyPath ?? "#",
  logoSrc: w.logoSrc ?? "/favicon.svg",
  logoAlt: w.logoAlt ?? w.title,
  brand: w.brand,
}));

/** @deprecated Use earlierSystems */
export const projects = earlierSystems.map((p) => ({
  title: p.title,
  year: p.year,
  description: p.description,
  challenge: p.challenge,
  recommendation: p.recommendation,
  result: p.result,
  tags: p.tags,
  href: p.href,
}));

export const projectsSection = workSection;
export const featuredProjectsSection = {
  eyebrow: workSection.eyebrow,
  title: workSection.title,
  description: workSection.description,
};
export const pastProjectsSection = { title: systemIndexSection.title };
