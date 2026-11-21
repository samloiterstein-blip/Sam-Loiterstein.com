/**
 * Single source of truth for site copy.
 * All entries follow AI-Policy.md, config-tone.txt, and STYLE-GUIDE.md.
 */

import type { LucideIcon } from "lucide-react";
import { Compass, Hammer, Layers, LineChart, Shield, Sparkles, Users } from "lucide-react";

// Site / global

export const site = {
  name: "Sam Loiterstein",
  initials: "SL",
  tagline: "AI expertise. Workflows. GTM as a Service.",
  description:
    "I design AI-powered workflows and GTM as a Service for community-facing companies. Product, RevOps, and go-to-market systems that hold at scale.",
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
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "writing", label: "Writing" },
  { id: "media", label: "Press" },
  { id: "background", label: "Background" },
  { id: "contact", label: "Contact" },
] as const;

export const sectionCtas = {
  approach: {
    lead: "You can start with the problem, even if you have no idea what the solution should be.",
    body: "Tell me where work gets stuck. I'll look at the people, process, and tools involved before proposing a build.",
    action: "Tell me what's stuck",
  },
  work: {
    lead: "See what the team needed, what I built, and what changed.",
    action: "Discuss a similar build",
  },
  writing: {
    action: "Read the latest piece",
  },
  background: {
    action: "See my experience",
  },
  engagements: {
    body: "I can define a focused project or ongoing product support after discussing the problem.",
    action: "Discuss the scope",
  },
} as const;

// Hero

export const hero = {
  eyebrow: "Washington, DC. Open to new engagements.",
  primaryCta: "See selected work",
  secondaryCta: "Discuss a project",
  lead: "I build the tools growing teams need when their workflows outgrow spreadsheets and disconnected software.",
  support:
    "I work with nonprofit and early-stage leaders to find the bottleneck, decide what to build, and get it into use.",
  rotatingTitles: [
    "Founder & Operator.",
    "Product Lead.",
    "RevOps Architect.",
    "GTM as a Service.",
    "AI Workflows.",
    "Community Builder.",
  ],
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
  title: "Build the system before the scale.",
  manifesto:
    "Background, how I work, security, scalability, and responsible AI. The record comes first. The system is built from there.",
} as const;

export type ApproachCard = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export type ApproachTabId = "credentials" | "process" | "security" | "scale" | "ai-ethics";

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
    id: "credentials",
    label: "Background",
    headline: "International study in neural networks and computer science.",
    paragraphs: [
      "My education is rigorous and international. At Vrije Universiteit Amsterdam I studied complex neural networks and the computer science behind applied machine learning. At The George Washington University I am in the Honors Program for a BS in Business Analytics, with a minor in Buddhist Ethics.",
      "Alongside that study, I have worked at companies of all sizes, from early-stage teams to large institutions.",
    ],
    record: [
      {
        id: "education",
        label: "Education",
        hint: "Academic programs and relevant coursework.",
      },
      {
        id: "certifications",
        label: "Certifications",
        hint: "Selected technical and professional credentials.",
      },
    ],
  },
  {
    id: "process",
    label: "How I Work",
    headline: "From an ambiguous problem to something your team can use.",
    paragraphs: [
      "Most teams don't need another tool. They need someone who can understand where work breaks down, define what should change, and take ownership of making it happen.",
      "My approach follows four stages.",
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
      "The goal is a solution that fits the organization, rather than forcing the organization to adapt to the technology.",
  },
  {
    id: "security",
    label: "Security",
    headline: "Build with the realities of your organization in mind.",
    paragraphs: [
      "Operational tools often touch sensitive information, internal systems, and workflows that teams depend on.",
      "Security needs to be considered from the beginning, particularly when AI and third-party integrations are involved.",
      "My approach prioritizes access, data, oversight, and accountability.",
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
    headline: "Build for today's constraints without creating tomorrow's bottlenecks.",
    paragraphs: [
      "Early-stage companies and nonprofit teams operate with limited time, budget, and technical capacity.",
      "A useful solution should make the current team more effective while remaining manageable as the organization changes.",
      "I prioritize simple architecture, clear ownership, repeatable workflows, and systems that can evolve without constant rebuilding.",
      "That means starting with the smallest solution that delivers measurable value, then improving it based on actual usage.",
      "Success isn't measured by how much technology gets introduced. It's measured by whether the team can do its work better.",
    ],
  },
  {
    id: "ai-ethics",
    label: "Responsible AI",
    headline: "Responsible AI starts with knowing where it belongs.",
    paragraphs: [
      "AI creates opportunities to reduce repetitive work, improve access to information, and help teams make better use of their time.",
      "It also introduces questions about reliability, privacy, bias, and accountability.",
      "I approach AI as one tool among many. Before introducing it into a workflow, I consider what problem it solves, what information it needs, how its outputs will be evaluated, and where human judgment must remain involved.",
      "The objective is to deploy AI where it serves a clear purpose, with safeguards that reflect the people and decisions affected by it.",
      "Sometimes the right recommendation is to use AI. Sometimes a simpler solution works better.",
    ],
  },
];

/** @deprecated Prefer approachTabs.find((t) => t.id === "process") */
export const approachSystem = approachTabs.find((tab) => tab.id === "process") ?? approachTabs[0];

export type Principle = ApproachCard;

export const principlesSection = {
  title: "How I build",
  cta: "Explore related systems",
  ctaHref: "#work",
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
  eyebrow: "Background",
  title: "Timeline",
  description:
    "My work sits between the person who owns the problem and the person who builds the solution.",
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
      title: "AI GTM and Revenue Operations Lead",
      org: "JamBase",
      logoLabel: "JB",
      logoSrc: "/logos/jambase.png",
      description:
        "SDRBase connects HubSpot, Apollo, and LinkedIn for research, outbound, forecasting, and reporting. Contributed to $5M+ in attributed sales.",
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
        "Live music discovery product with genre intelligence in production. Mobile-first community layer from show discovery through the night of the concert.",
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
        "Programs, grants, and partnerships across 500+ communities in 60+ countries, and donor acknowledgments for $1M+ in assets.",
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
  credentialsSummary: "9 credentials across Salesforce, HubSpot, Apollo, LinkedIn, CFA Institute, and Federal Reserve data programs.",
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
  ] satisfies CredentialEntry[],
  pdfButtonLabel: "Download Resume PDF",
} as const;

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
    .filter((entry) => entry.logoSrc)
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

export type HomepageGroup = "founder-work" | "fractional-expertise";

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
  drawerSections?: { heading: string; bullets: string[] }[];
};

export type ProblemPrompt = {
  id: string;
  label: string;
  workSlug: string;
};

export const workSection = {
  eyebrow: "Portfolio",
  title: "Selected work",
  description:
    "Founder work, fractional and intern experience, projects, and public repositories. Each entry links to working proof, a documented case, or the repository.",
  problemPickerLabel: "What are you working through?",
  briefToggleShow: "Executive brief",
  briefToggleHide: "Full case",
} as const;

export type PortfolioTabId = "founder" | "fractional" | "projects" | "git";

export const portfolioTabs: { id: PortfolioTabId; label: string }[] = [
  { id: "founder", label: "Founder Work" },
  { id: "fractional", label: "Fractional / Intern Experience" },
  { id: "projects", label: "Projects" },
  { id: "git", label: "From GitHub" },
];

export const founderWorkSection = {
  title: "Founder Work",
} as const;

export const fractionalExpertiseSection = {
  title: "Fractional / Intern Experience",
  description: "Internships and scoped operating roles inside other organizations.",
} as const;

export const systemIndexSection = {
  title: "Projects",
  description: "Additional products, models, research, and publishing work.",
} as const;

export const gitSection = {
  title: "Straight from GitHub",
  description: "Public repositories, loaded from GitHub.",
  profileLabel: "View GitHub profile",
  empty: "Public repositories are unavailable right now.",
  loading: "Loading repositories.",
} as const;

export const engagementsSection = {
  eyebrow: "When I take an engagement",
  description:
    "Bring me a workflow that needs fixing, a product that needs direction, or a build your team has not had capacity to ship.",
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
    outcome: "Platform live at getsynth.app with genre intelligence powering personalized discovery feeds.",
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
        "A mobile-first product for discovering concerts, finding friends headed to the same shows, and sharing the experience.",
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
    title: "SDR-as-a-Service",
    year: "2026",
    description: "Integrated sales environment across LinkedIn, Apollo, and HubSpot.",
    stakes: "Reps lose hours switching between research, outbound, and CRM hygiene before they talk to a buyer.",
    brief:
      "I built one operating workspace for JamBase: accounts, signals, sequences, and RevOps reporting with live HubSpot sync and AI-assisted signal classification.",
    problem:
      "Outbound, research, CRM hygiene, and comms prep lived in separate tools, slowing one unified sales motion.",
    approach:
      "Custom integrated environment connecting LinkedIn, Apollo, and HubSpot with OpenAPI contracts, typed client hooks, and RevOps dashboards.",
    outcome:
      "One operating environment for prep, execution, outbound, and CRM management. Contributed to $5M+ in attributed sales and 200%+ year-over-year revenue growth on a new product.",
    constraints: "Forecast visibility required live CRM sync, reviewer feedback on AI classifications, and brand-safe outbound assets.",
    stack: ["HubSpot", "Apollo", "LinkedIn", "TypeScript", "RevOps"],
    tags: ["RevOps", "HubSpot", "Apollo", "LinkedIn"],
    liveUrl: "https://data.jambase.com",
    caseStudyPath: "/case-studies/sdr-automation-application.html",
    logoSrc: "/logos/jambase.png",
    logoAlt: "JamBase logo",
    previewSrc: "/logos/jambase.png",
    previewAlt: "JamBase logo",
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
      group: "fractional-expertise",
      order: 2,
      competency: "revenue-operations",
      competencyLabel: "Revenue operations",
      proofType: "case-study",
      proofLabel: "View the project",
      displayTitle: "JamBase Revenue System",
      cardDescription:
        "AI GTM and revenue operations. SDRBase connects HubSpot, Apollo, and LinkedIn for research, outbound, forecasting, and reporting.",
      displayTags: ["RevOps", "HubSpot", "Apollo", "LinkedIn"],
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
        "An operating model for training analysts, managing delivery, and serving clients as the organization scaled.",
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
      "Production pipeline transforming metadata into genre taxonomies, embeddings, and personalized feed outputs.",
    constraints: "Explainability mattered: taxonomy paths and cluster keys had to be inspectable by product and ops teams.",
    stack: ["Python", "SQL", "ML", "R"],
    tags: ["Python", "SQL", "ML", "AI"],
    caseStudyPath: "/case-studies/genre-intelligence-engine.html",
    homepage: {
      tier: "index",
      order: 1,
      competency: "data-ai",
      competencyLabel: "Data and AI",
      proofType: "case-study",
      proofLabel: "View the project",
      cardDescription:
        "A two-stage pipeline that turns artist and event metadata into genre taxonomies, embeddings, and personalized recommendations.",
      displayTags: ["Python", "SQL", "Machine Learning", "AI"],
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
    description: "Analytics framework to classify pipeline behavior and improve forecast discipline.",
    stakes: "Forecast meetings become arguments when stage names no longer describe deal behavior.",
    brief:
      "I mapped win/loss signals to probability tiers and rebuilt CRM scoring so leadership could prioritize the same opportunities reps were actually closing.",
    problem:
      "Pipeline stages did not reflect actual deal behavior, weakening forecast accuracy.",
    approach:
      "Classification framework mapping pipeline signals to probability tiers with reporting for product line views.",
    outcome:
      "Improved forecast discipline and prioritization across high-probability opportunities.",
    constraints: "Scoring had to be legible to managers for intervention on stalled deals, not only for executive roll-ups.",
    stack: ["Analytics", "JavaScript", "TypeScript", "RevOps"],
    tags: ["Analytics", "JavaScript", "TypeScript", "RevOps"],
    caseStudyPath: "/case-studies/indiagrowthcorp-revops-analytics.html",
    homepage: {
      tier: "index",
      order: 3,
      competency: "revenue-operations",
      competencyLabel: "Revenue operations",
      proofType: "case-study",
      proofLabel: "View the project",
      cardDescription:
        "A revenue analytics framework for classifying pipeline behavior, improving forecast discipline, and prioritizing high-probability opportunities.",
      displayTags: ["Analytics", "RevOps", "JavaScript"],
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
    description: "Multi-tenant platform for AI-assisted LinkedIn publishing with team analytics.",
    stakes: "Enterprise teams need distribution without letting AI flatten every author into the same voice.",
    brief:
      "I designed a multi-tenant publishing system with voice fingerprinting, approval workflows, and team analytics so governance and authenticity stay in tension on purpose.",
    problem:
      "Enterprise teams needed consistent LinkedIn voice, automated posting, and visibility into team performance.",
    approach:
      "Multi-tenant platform with configurable voice controls, automated posting workflows, and team analytics.",
    outcome:
      "Platform architecture for AI-assisted publishing with automated workflows and analytics dashboards.",
    constraints: "Role-based workflows, pre-publish checks, and edit-distance feedback loops were required before any auto-post path went live.",
    stack: ["AI", "Analytics", "JavaScript", "TypeScript"],
    tags: ["AI", "Analytics", "JavaScript", "TypeScript"],
    caseStudyPath: "/case-studies/enterprise-linkedin-voice-analytics.html",
    homepage: {
      tier: "index",
      order: 2,
      competency: "product-community",
      competencyLabel: "Product and publishing",
      proofType: "case-study",
      proofLabel: "View the project",
      cardDescription:
        "A multi-tenant publishing platform with AI-assisted drafting, configurable voice controls, approval workflows, and team analytics.",
      displayTags: ["AI", "Analytics", "Publishing"],
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
        "A college-focused editorial system with SEO structure, social distribution, and syndication to Quill and Pad.",
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
      group: "fractional-expertise",
      order: 5,
      competency: "organization-operations",
      competencyLabel: "Community and events",
      proofType: "case-study",
      proofLabel: "View the project",
      displayTitle: "BBYO",
      cardDescription:
        "Programs, grants, and partnerships across 500+ communities in 60+ countries, including convention programming and donor acknowledgments.",
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
      tier: "selected",
      group: "fractional-expertise",
      order: 1,
      competency: "data-ai",
      competencyLabel: "Research and automation",
      proofType: "external-project",
      proofLabel: "Visit foundation",
      displayTitle: "U.S. Chamber of Commerce Foundation",
      cardDescription:
        "Innovation Scholar work on AI, automation, data ingestion, and reporting workflows for foundation programs.",
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
      tier: "selected",
      group: "fractional-expertise",
      order: 4,
      competency: "revenue-operations",
      competencyLabel: "Revenue operations",
      proofType: "external-project",
      proofLabel: "Visit SBI",
      displayTitle: "SBI, The Growth Advisory",
      cardDescription:
        "Restructured 13,000+ Salesforce contacts, accounts, and personas, and reported on $51M+ of pipeline across 6 offerings.",
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
      tier: "selected",
      group: "fractional-expertise",
      order: 6,
      competency: "organization-operations",
      competencyLabel: "Finance and compliance",
      proofType: "external-project",
      proofLabel: "Visit St. Louis Fed",
      displayTitle: "Federal Reserve Bank of St. Louis",
      cardDescription:
        "Compliance audits for 600+ organizations, a $750K facilities budget, and 1,000+ software procurement records.",
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
      "24/7 response operations platform deployed for partner data visualization and branding automation.",
    stack: ["JavaScript", "TypeScript", "Python", "SQL"],
    tags: ["JavaScript", "TypeScript", "Python", "SQL"],
    liveUrl: "https://247daymap.conveniencecares.org/",
    previewSrc: "/images/nacs-foundation-map.png",
    previewAlt: "NACS Foundation 24/7 Day store locator map",
    homepage: {
      tier: "selected",
      group: "fractional-expertise",
      order: 3,
      competency: "product-community",
      competencyLabel: "Product and data",
      proofType: "live-product",
      proofLabel: "Visit project",
      displayTitle: "NACS Foundation Map",
      cardDescription:
        "A Node and Express platform with data ingestion, geocoding, map visualization, and media-kit generation.",
      displayTags: ["JavaScript", "Python", "SQL"],
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
        "A multi-country infrastructure study comparing compliance, emissions, and energy demand through statistical analysis and data visualization.",
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

export const selectedSystems = workSystems.filter((s) => s.homepage.tier === "selected").sort(byHomepageOrder);

export const systemIndex = workSystems.filter((s) => s.homepage.tier === "index").sort(byHomepageOrder);

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
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
};

export const servicesSection = {
  eyebrow: "Work with me",
  title: "When I take an engagement",
  description:
    "I take on a small number of builds covering AI expertise, workflows, and GTM as a Service. If anything below matches your scope, send a note.",
  ctaPrompt: "Have a different problem?",
  ctaSubcopy: "Share what you are working on. Mismatched inquiries are referred elsewhere.",
  ctaButton: "Contact",
};

export const services: Service[] = [
  {
    title: "GTM as a Service",
    description: "For founders who need ICP, positioning, sales motion, and shipping experiments without building a full GTM bench.",
    bullets: ["ICP and positioning", "Sales motion", "Experiments that ship"],
    icon: LineChart,
  },
  {
    title: "AI expertise and workflows",
    description: "For teams that need research, enrichment, classification, and drafting inside governed processes people can trust.",
    bullets: ["Agentic backends", "Approval and ownership", "Workflow design"],
    icon: Sparkles,
  },
  {
    title: "RevOps and CRM systems",
    description: "For teams whose pipeline, Salesforce, HubSpot, reporting, or handoffs need structure.",
    bullets: ["Pipeline hygiene", "Apollo, Salesforce, and HubSpot", "Reporting and handoffs"],
    icon: Compass,
  },
  {
    title: "Product strategy and MVP builds",
    description: "For teams turning raw ideas into scoped products, prototypes, dashboards, or lightweight internal tools.",
    bullets: ["Scoping and specs", "Prototypes and MVPs", "Internal tools"],
    icon: Hammer,
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
  eyebrow: "Writing and press",
  title: "Notes and coverage",
  description:
    "I write about building products, running lean teams, and the problems that appear between strategy and execution.",
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
  title: "Get in touch.",
  description:
    "Reach out about an engagement, a project, or an introduction. I read everything that lands here.",
  emailLabel: "Email",
  emailHint: "For project and engagement inquiries.",
  currently: {
    heading: "Currently",
    body: "Taking on a small number of engagements. Replies usually within 24 hours.",
  },
  form: {
    intentLabel: "Topic",
    intentDefault: "Select a topic (optional)",
    placeholders: {
      name: "Your name",
      email: "you@company.com",
      message: "Share what you are working on.",
    },
    sendButton: "Send message",
    sendingLabel: "Sending",
    successHeading: "Message sent.",
    successBody:
      "Thanks for reaching out. I reply within 24 hours. Connect on LinkedIn in the meantime.",
    successAction: "Send another message",
    validation: {
      nameRequired: "Please enter your name.",
      emailRequired: "Email is required.",
      emailInvalid: "Please provide a valid email.",
      messageShort: "Add a few more words.",
      messageLong: "Message is too long.",
      spam: "Spam detected.",
      generic: "Unable to send right now.",
    },
  },
  intents: [
    {
      id: "gtm",
      label: "GTM as a Service",
      placeholder:
        "We are at [stage] and need GTM as a Service for ICP, positioning, or sales motion. Our current challenge is…",
    },
    {
      id: "ai-workflows",
      label: "AI expertise and workflows",
      placeholder:
        "We need AI expertise embedded in workflows for research, classification, or drafting. Our current process is…",
    },
    {
      id: "revops",
      label: "RevOps and CRM systems",
      placeholder:
        "Our pipeline and CRM stack need structure. We use [tools] and the main friction is…",
    },
    {
      id: "product",
      label: "Product and MVP build",
      placeholder:
        "We have a product idea or internal tool need. Scope, timeline, and constraints look like…",
    },
    {
      id: "founder",
      label: "Founder conversation",
      placeholder:
        "I am building [company/product] and would like to compare notes on…",
    },
    {
      id: "other",
      label: "Other",
      placeholder: "Share what you are working on.",
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
