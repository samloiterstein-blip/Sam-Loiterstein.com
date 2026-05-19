/**
 * Single source of truth for site copy.
 * All entries follow AI-Policy.md, config-tone.txt, and STYLE-GUIDE.md.
 *
 * Editing rules:
 *  - No em dashes or en dashes. Use commas, periods, colons, parentheses, or "to".
 *  - No interpuncts, ellipses, or multiplication signs in copy. Use commas or "and".
 *  - No subjective qualifiers (successful, lucky, best, select, etc.).
 *  - Section titles are noun phrases or short declarative sentences.
 *    Add a period only when the title is a full sentence.
 */

import type { LucideIcon } from "lucide-react";
import { Compass, Hammer, LineChart, Sparkles } from "lucide-react";

// Site / global

export const site = {
  name: "Sam Loiterstein",
  initials: "SL",
  tagline: "Builder. Operator. Growth partner.",
  description:
    "I help early stage teams turn early concepts into usable products, repeatable systems, and defined go to market motion.",
  email: "samloiterstein@gmail.com",
  location: "Washington, DC",
  resumeUrl: "/Sam-Loiterstein-Resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/sam-loiterstein",
    email: "mailto:samloiterstein@gmail.com",
  },
} as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "media", label: "Press" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
] as const;

// Hero

export const hero = {
  eyebrow: "Washington, DC. Open to new engagements.",
  stats: [
    { value: "200+", label: "Analysts scaled" },
    { value: "20+", label: "Clients served" },
    { value: "$51M+", label: "Pipeline analyzed" },
    { value: "6", label: "Product lines supported" },
    { value: "4+", label: "Product launches" },
  ],
} as const;

// About

export const about = {
  eyebrow: "About",
  title: "Operator and founder",
  bioParagraphs: [
    "Sam Loiterstein is a Business Analytics student at The George Washington University building across product, consulting, revenue operations, and live music.",
    "He co-founded Nexus Consulting and scaled it from a founding team into a 200+ analyst organization serving 20+ clients. He founded Synth to make live music discovery more social and accessible.",
    "His work combines operator discipline, product taste, and go to market systems thinking.",
  ],
  values: [
    {
      title: "Build patiently",
      body: "Durable companies come from clear systems, consistent feedback loops, and measured release cadence.",
    },
    {
      title: "Operator's eye",
      body: "Strategy has to survive the calendar, the CRM, the team meeting, and the customer call.",
    },
    {
      title: "Surface signals",
      body: "Products, decks, workflows, and brands communicate before anyone reads the fine print.",
    },
  ],
  headshot: {
    /**
     * Tried in order until one loads. Files must live in client/public/.
     * Vite serves them at the site root (e.g. /Headshot.jpeg).
     */
    sources: [
      "/images/about-headshot-tight.jpg",
      "/Headshot.jpeg",
      "/headshot.jpeg",
      "/Headshot.jpg",
      "/headshot.jpg",
      "/Headshot.JPG",
      "/Headshot.JPEG",
    ],
    alt: "Portrait of Sam Loiterstein.",
    caption: "Sam Loiterstein, Washington, DC",
  },
} as const;

// Resume

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
  highlights?: string[];
};

export type CredentialEntry = {
  title: string;
  issuer: string;
  logoSrc?: string;
  logoLabel?: string;
  credentialId?: string;
  credentialUrl?: string;
};

export const resume = {
  eyebrow: "Resume",
  title: "Past roles and education",
  description: "Roles, internships, and education.",
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
        "Building a live music platform for discovering shows, connecting with fans, and turning concerts back into shared experiences.",
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
        "Scaled a student powered consulting firm into a 200+ analyst organization serving 20+ clients across strategy, operations, and business development.",
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
        "Supported forecasting, Salesforce data rigor, pipeline analysis, and product line reporting across a $51M+ pipeline.",
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
        "Supported programs, partnerships, grants, donor operations, and community experiences across a global youth organization.",
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
        "Managed compliance, budgeting, procurement tracking, and reporting systems.",
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
        "Coursework across analytics, strategy, and operations. Active in founder, consulting, and student leadership communities on campus.",
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
        "International exchange focused on analytics, European go to market patterns, and applied business research.",
    },
  ] satisfies TimelineEntry[],
  credentialsTitle: "Licenses and certifications",
  credentials: [
    {
      title: "LinkedIn Developer",
      issuer: "LinkedIn",
      logoSrc: "/logos/linkedin.svg",
      credentialUrl: "https://www.linkedin.com/in/sam-loiterstein",
    },
    {
      title: "Investment Foundations Certificate",
      issuer: "CFA Institute",
      logoSrc: "/logos/cfa-institute.svg",
      credentialId: "125881533",
    },
    {
      title: "Storytelling with Data",
      issuer: "Federal Reserve Bank of St. Louis",
      logoSrc: "/logos/federal-reserve.png",
    },
    {
      title: "Using Data Ethically",
      issuer: "Federal Reserve Bank of St. Louis",
      logoSrc: "/logos/federal-reserve.png",
    },
    {
      title: "Blogging About Data",
      issuer: "Federal Reserve Bank of St. Louis",
      logoSrc: "/logos/federal-reserve.png",
    },
    {
      title: "FRED Data Blogging",
      issuer: "Federal Reserve Bank of St. Louis",
      logoSrc: "/logos/federal-reserve.png",
    },
    {
      title: "HubSpot Developer",
      issuer: "HubSpot",
      logoSrc: "/logos/hubspot.svg",
    },
    {
      title: "Apollo Developer",
      issuer: "Apollo",
      logoSrc: "/logos/apollo.png",
    },
    {
      title: "Salesforce Developer",
      issuer: "Salesforce",
      logoSrc: "/logos/salesforce.svg",
    },
  ] satisfies CredentialEntry[],
  pdfButtonLabel: "Download Resume PDF",
} as const;

// LinkedIn card

export const linkedin = {
  eyebrow: "Connect on LinkedIn",
  name: "Sam Loiterstein",
  tagline:
    "Founder at Synth and Co-Founder, CEO at Nexus Consulting. Building at the intersection of product, operations, and go to market execution.",
  location: "Washington, DC",
  status: "Open to partnerships, operators, and founders",
  photoSrc: "/Headshot.jpeg",
  photoAlt: "Portrait of Sam Loiterstein.",
  buttonLabel: "Open LinkedIn",
  url: "https://www.linkedin.com/in/sam-loiterstein",
} as const;

// Projects

export type Project = {
  title: string;
  year: string;
  description: string;
  tags: string[];
  href?: string;
};

export type FeaturedProject = Project & {
  href: string;
  logoSrc: string;
  logoAlt: string;
  brand: {
    accent: string;
    accentMuted: string;
    surface: string;
    border: string;
    tagBg: string;
    tagText: string;
    logoBackground?: string;
  };
};

export const projectsSection = {
  eyebrow: "Work",
  title: "Past work, services, and use cases",
  description:
    "Selected ventures plus the engagements and operating problems I help solve.",
};

export const featuredProjectsSection = {
  eyebrow: "Founder work",
  title: "Ventures I am building",
  description: "",
};

export const featuredProjects: FeaturedProject[] = [
  {
    title: "Synth",
    year: "2025",
    description:
      "Live music discovery and fan connection platform built to make concerts more social and accessible. Synth helps music lovers find shows, match with friends going to the same events, and share the live experience in one mobile-first community, from discovery through encore.",
    tags: ["Product", "Consumer", "Music", "Mobile"],
    href: "https://getsynth.app",
    logoSrc: "/logos/synth.png",
    logoAlt: "Synth logo",
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
    title: "Nexus Consulting",
    year: "2024",
    description:
      "Student-powered consulting firm scaled from four founders into a 200+ analyst organization serving 20+ clients. Nexus trains analysts and delivers strategy, operations, and business development for client teams.",
    tags: ["Consulting", "Operations", "Growth"],
    href: "https://nxsconsultants.com",
    logoSrc: "/logos/nexus.png",
    logoAlt: "Nexus Consulting logo",
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
    title: "SDR-as-a-Service",
    year: "2026",
    description:
      "Custom integrated environment for JamBase across LinkedIn, Apollo, and HubSpot. Supports marketing, PR, comms, prep, research, execution, outbound, and CRM management across one sales motion.",
    tags: ["RevOps", "HubSpot", "Apollo", "LinkedIn"],
    href: "https://data.jambase.com",
    logoSrc: "/logos/sdr.svg",
    logoAlt: "SDR-as-a-Service for JamBase",
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
];

export const projects: Project[] = [
  {
    title: "Genre Intelligence Engine",
    year: "2025",
    description:
      "Built a two stage mining pipeline to transform artist and event metadata into genre taxonomies, embeddings, cluster affinity, and personalized feed outputs.",
    tags: ["Python", "SQL", "ML", "AI"],
    href: "/case-studies/genre-intelligence-engine.html",
  },
  {
    title: "Revenue Operations Classification",
    year: "2025",
    description:
      "Built a revenue operations analytics framework to classify pipeline behavior, improve forecast discipline, and prioritize high-probability opportunities.",
    tags: ["Analytics", "JavaScript", "TypeScript", "RevOps"],
    href: "/case-studies/indiagrowthcorp-revops-analytics.html",
  },
  {
    title: "Partner data ingestion, visualization and branding automation workflow",
    year: "2025",
    description:
      "Built and deployed a Node and Express mapping platform with ingest workflows, geocoding, media-kit generation, and optional Supabase persistence for 24/7 response operations.",
    tags: ["JavaScript", "TypeScript", "Python", "SQL"],
    href: "https://www.conveniencecares.org/24-7-Day",
  },
  {
    title: "Sustainable AI Data Centers Research",
    year: "2025",
    description:
      "Produced a multi-country AI infrastructure study with statistical comparisons and poster-ready visual narratives focused on compliance, emissions, and energy demand.",
    tags: ["R", "Python", "Data Viz", "Policy"],
    href: "/case-studies/sustainable-ai-data-centers-research.html",
  },
  {
    title: "Enterprise LinkedIn Voice + Analytics",
    year: "2025",
    description:
      "Designed a multi-tenant enterprise platform for AI-assisted LinkedIn publishing with automated posting workflows, team analytics, and configurable voice controls.",
    tags: ["AI", "Analytics", "JavaScript", "TypeScript"],
    href: "/case-studies/enterprise-linkedin-voice-analytics.html",
  },
];

// In the news / Media

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
  description: "Recent appearances and conversations.",
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

// Services / Ways I can help

export type Service = {
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
};

export const servicesSection = {
  eyebrow: "Work with me",
  title: "Ways I can help",
  description:
    "I take on a small number of engagements at a time. If anything below matches your scope, send a note.",
  ctaPrompt: "Have a different problem?",
  ctaSubcopy:
    "Tell me what you are working on. I will refer mismatched inquiries elsewhere.",
  ctaButton: "Contact",
};

export const services: Service[] = [
  {
    title: "Startup GTM and growth strategy",
    description:
      "For founders defining ICP, positioning, sales motion, and shipping experiments.",
    bullets: ["ICP and positioning", "Sales motion", "Experiments that ship"],
    icon: LineChart,
  },
  {
    title: "RevOps and CRM systems",
    description:
      "For teams whose pipeline, Salesforce, HubSpot, reporting, or handoffs need structure.",
    bullets: ["Pipeline hygiene", "Apollo, Salesforce, and HubSpot", "Reporting and handoffs"],
    icon: Compass,
  },
  {
    title: "Product strategy and MVP builds",
    description:
      "For teams turning raw ideas into scoped products, prototypes, dashboards, or lightweight internal tools.",
    bullets: ["Scoping and specs", "Prototypes and MVPs", "Internal tools"],
    icon: Hammer,
  },
  {
    title: "Student powered research and execution",
    description:
      "For companies running research, market mapping, competitive analysis, or execution sprints.",
    bullets: ["Market mapping", "Competitive analysis", "Execution capacity"],
    icon: Sparkles,
  },
];

// Insights / Blog

export type InsightDraft = {
  title: string;
  tag: "Product" | "Operations" | "GTM" | "Strategy";
  date: string;
};

export const insights = {
  eyebrow: "Insights, coming soon",
  title: "Notes from the work",
  description:
    "Essays on building, operating, and writing. Published when there is something to say.",
  drafts: [
    {
      title: "Live music social infrastructure",
      tag: "Product",
      date: "Coming soon",
    },
    {
      title: "What student consulting teaches about operating systems",
      tag: "Operations",
      date: "Coming soon",
    },
    {
      title: "RevOps is a product problem",
      tag: "GTM",
      date: "Coming soon",
    },
    {
      title: "Taste in growth systems",
      tag: "Strategy",
      date: "Coming soon",
    },
  ] satisfies InsightDraft[],
};

// Contact

export const contact = {
  eyebrow: "Contact",
  title: "Let's talk.",
  description:
    "Reach out about an engagement, a project, or an introduction. I read everything that lands here.",
  emailLabel: "Email",
  emailHint: "For project and engagement inquiries.",
  currently: {
    heading: "Currently",
    body: "Taking on a small number of engagements. Replies usually within 24 hours.",
  },
  form: {
    placeholders: {
      name: "Your name",
      email: "you@company.com",
      message: "Tell me what you are working on.",
    },
    sendButton: "Send message",
    sendingLabel: "Sending",
    successHeading: "Message sent.",
    successBody:
      "Thanks for reaching out. I will reply within 24 hours. Connect on LinkedIn in the meantime.",
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
} as const;

// Footer

export const footer = {
  builtNote: "",
} as const;
