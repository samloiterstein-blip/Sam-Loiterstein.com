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
  tagline: "Community. Media. Analytics. Startups.",
  description:
    "I build operating systems for community-facing companies. When discovery, sales, and programs run on separate tools, the whole motion slows. I design the layer that holds at scale.",
  email: "samloiterstein@gmail.com",
  location: "Washington, DC",
  resumeUrl: "/Sam-Loiterstein-Resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/sam-loiterstein",
    email: "mailto:samloiterstein@gmail.com",
  },
} as const;

export const navItems = [
  { id: "approach", label: "Approach" },
  { id: "work", label: "Systems" },
  { id: "writing", label: "Writing" },
  { id: "media", label: "Press" },
  { id: "background", label: "Background" },
  { id: "contact", label: "Contact" },
] as const;

// Hero

export const hero = {
  eyebrow: "Washington, DC. Open to new engagements.",
  primaryCta: "Explore systems",
  secondaryCta: "Start a conversation",
  description:
    "I turn early-stage ideas into usable products, repeatable revenue systems, and clear go-to-market motion. My work connects product, operations, data, and growth.",
  rotatingTitles: [
    "Founder & Operator.",
    "Product Lead.",
    "RevOps Architect.",
    "GTM Strategist.",
    "AI & Analytics.",
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
    "Across products, teams, and revenue operations, I’ve learned that growth holds only when the underlying system is clear. I build the workflows, data structures, governance, and feedback loops that turn promising work into repeatable execution.",
} as const;

export type ApproachCard = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export const approachSystem = {
  summary:
    "People set judgment and ownership. Workflow turns intent into repeatable execution. AI agents handle research, classification, and draft work at speed. Each layer feeds the others so the system stays accountable, understandable, and fast.",
  nodes: [
    {
      id: "people",
      label: "People",
      blurb: "Leaders and operators who set priorities, approve decisions, and own outcomes.",
    },
    {
      id: "workflow",
      label: "Workflow",
      blurb: "The process, data model, and handoffs that turn strategy into daily execution.",
    },
    {
      id: "agent",
      label: "AI Agent",
      blurb: "Automated research, enrichment, and drafting that keeps the workflow moving.",
    },
  ],
  stagesTitle: "How engagements run",
  stages: [
    {
      title: "Discovery and alignment",
      body: "Map your goals, stakeholders, data, and constraints before scoping the build.",
    },
    {
      title: "Design and delivery",
      body: "Build the workflow, tools, and integrations your team runs day to day.",
    },
    {
      title: "Launch and adoption",
      body: "Train owners, document the model, and embed the system in operations.",
    },
    {
      title: "Improve and expand",
      body: "Measure outcomes, refine the system, and extend scope where value holds.",
    },
  ],
} as const;

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
    body: "I ship ML where data is cleaned first and failure modes are named: genre taxonomies, voice-controlled publishing, and signal classification with reviewer feedback loops.",
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
  description: "Roles and education behind the systems above.",
  experience: [
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
      title: "Revenue Operations",
      org: "SBI, The Growth Advisory",
      logoLabel: "SBI",
      logoSrc: "/logos/sbi.png",
      description:
        "Rebuilt pipeline classification and forecast reporting so stage labels matched deal behavior across product lines.",
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
        "Programs, partnerships, grants, and convention operations across a global youth movement.",
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
        "Compliance, budgeting, procurement tracking, and reporting in an institutional environment.",
    },
  ] satisfies TimelineEntry[],
  education: [
    {
      period: "2023 to 2027",
      startYear: 2023,
      endYear: 2027,
      barColor: "#002856",
      title: "BS, Business Analytics, Honors Program",
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
        "Applied ML and business research with European go to market context.",
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
  eyebrow: "Systems",
  title: "Selected systems",
  description:
    "Products and operating systems built across music, revenue, and organizational growth. Each entry links to working proof or a documented case.",
  problemPickerLabel: "What are you working through?",
  briefToggleShow: "Executive brief",
  briefToggleHide: "Full case",
} as const;

export const founderWorkSection = {
  title: "Founder Work",
} as const;

export const fractionalExpertiseSection = {
  title: "Fractional expertise",
} as const;

export const systemIndexSection = {
  title: "More systems",
  description: "Additional products, models, research, and publishing work.",
} as const;

export const engagementsSection = {
  eyebrow: "When I take an engagement",
  description:
    "I take on a small number of builds where a team needs someone who can own the system, not only the slide deck. If the scope below matches, send a note.",
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
      "One operating environment for prep, execution, outbound, and CRM management across the full JamBase sales motion.",
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
      proofLabel: "Read case study",
      displayTitle: "JamBase Revenue System",
      cardDescription:
        "A connected LinkedIn, Apollo, and HubSpot environment for research, outbound, and CRM execution.",
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
      proofLabel: "Read case study",
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
      proofLabel: "Read case study",
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
      proofLabel: "Read case study",
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
      tier: "index",
      order: 5,
      competency: "organization-operations",
      competencyLabel: "Community and events",
      proofType: "case-study",
      proofLabel: "Read case study",
      displayTitle: "BBYO Convention",
      cardDescription:
        "Regional convention coordination and summer leadership programming with team-based structures for onboarding and logistics.",
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
      order: 1,
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
  eyebrow: "In the news",
  title: "Press, podcasts, and mentions",
  description: "Editorial, research, and civic conversations alongside the operating work.",
};

export const media: MediaItem[] = [
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
    "I take on a small number of builds at a time. If anything below matches your scope, send a note.",
  ctaPrompt: "Have a different problem?",
  ctaSubcopy: "Share what you are working on. Mismatched inquiries are referred elsewhere.",
  ctaButton: "Contact",
};

export const services: Service[] = [
  {
    title: "Startup GTM and growth strategy",
    description: "For founders defining ICP, positioning, sales motion, and shipping experiments.",
    bullets: ["ICP and positioning", "Sales motion", "Experiments that ship"],
    icon: LineChart,
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
  {
    title: "Research and execution",
    description: "For companies running research, market mapping, competitive analysis, or execution sprints.",
    bullets: ["Market mapping", "Competitive analysis", "Execution capacity"],
    icon: Sparkles,
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

export const substack = {
  /** RSS + embed host */
  publicationHost: "sloiterstein.substack.com",
  /** Public profile URL */
  profileUrl: "https://substack.com/@sloiterstein",
  eyebrow: "Writing",
  title: "Notes from the work",
  description:
    "Essays on building, operating, and go to market. Published on Substack and indexed here for discovery.",
  readLabel: "Read on Substack",
  subscribeLabel: "Subscribe on Substack",
  emptyState:
    "Posts will appear here after the next deploy, or once the publication URL is configured.",
  feedPath: "/substack-feed.json",
  apiPath: "/api/substack-feed",
  postLimit: 8,
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
      label: "GTM and positioning",
      placeholder:
        "We are at [stage] and need help defining ICP, positioning, or sales motion. Our current challenge is…",
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
      id: "research",
      label: "Research sprint",
      placeholder:
        "We need market mapping, competitive analysis, or execution capacity for…",
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
