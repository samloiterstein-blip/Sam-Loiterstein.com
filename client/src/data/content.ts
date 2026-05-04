/**
 * Single source of truth for site copy.
 * All entries follow AI-Policy.md and STYLE-GUIDE.md.
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
    "I help early stage teams turn messy ideas into usable products, repeatable systems, and sharper go to market motion.",
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
      body: "Durable companies come from clear systems, consistent feedback loops, and less performative urgency.",
    },
    {
      title: "Operator's eye",
      body: "Good strategy has to survive the calendar, the CRM, the team meeting, and the customer call.",
    },
    {
      title: "Taste matters",
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
  title: string;
  org: string;
  logoLabel?: string;
  logoSrc?: string;
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
      title: "Founder",
      org: "Synth Inc",
      logoLabel: "SY",
      logoSrc: "/logos/synth.png",
      description:
        "Building a live music platform for discovering shows, connecting with fans, and turning concerts back into shared experiences.",
    },
    {
      period: "2024 to Present",
      title: "Co-Founder and CEO",
      org: "Nexus Consulting",
      logoLabel: "NX",
      logoSrc: "/logos/nexus.png",
      description:
        "Scaled a student powered consulting firm into a 200+ analyst organization serving 20+ clients across strategy, operations, and business development.",
    },
    {
      period: "2025",
      title: "Revenue Operations",
      org: "SBI, The Growth Advisory",
      logoLabel: "SBI",
      logoSrc: "/logos/sbi.png",
      description:
        "Supported forecasting, Salesforce data rigor, pipeline analysis, and product line reporting across a $51M+ pipeline.",
    },
    {
      period: "2024 to 2025",
      title: "Movement Building and Operations",
      org: "BBYO",
      logoLabel: "BBYO",
      logoSrc: "/logos/bbyo.png",
      description:
        "Supported programs, partnerships, grants, donor operations, and community experiences across a global youth organization.",
    },
    {
      period: "2023",
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
      title: "BS, Business Analytics, Honors Program",
      org: "The George Washington University",
      logoSrc: "/logos/gwu.png",
      description:
        "Coursework across analytics, strategy, and operations. Active in founder, consulting, and student leadership communities on campus.",
    },
    {
      period: "2025 to 2026",
      title: "Student in residence AI / Machine Learning",
      org: "Vrije Universiteit Amsterdam",
      logoLabel: "VU",
      logoSrc: "/logos/vu.png",
      description:
        "International exchange focused on analytics, European go to market patterns, and applied business research.",
    },
    {
      period: "2019 to 2023",
      title: "High School",
      org: "Ladue Horton Watkins High School",
      logoLabel: "LHW",
      logoSrc: "/logos/ladue.png",
      description:
        "Completed core college preparatory coursework and co-curricular leadership activities.",
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

export const projectsSection = {
  eyebrow: "Work",
  title: "Past work, services, and use cases",
  description:
    "Selected ventures plus the engagements and operating problems I help solve.",
};

export const projects: Project[] = [
  {
    title: "Synth",
    year: "2025",
    description:
      "Live music discovery and fan connection platform built to make concerts more social and accessible.",
    tags: ["Product", "Consumer", "Music", "Mobile"],
    href: "https://getsynth.app",
  },
  {
    title: "Nexus Consulting",
    year: "2024",
    description:
      "Student powered consulting firm scaled from 4 founders to 200+ analysts and 20+ clients.",
    tags: ["Consulting", "Operations", "Growth"],
    href: "https://nxsconsultants.com",
  },
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
    href: "/case-studies/nacs-foundation-partner-map.html",
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
      "Designed a white-label enterprise platform for AI-assisted LinkedIn thought leadership with automated posting workflows, team analytics, and human-like voice controls.",
    tags: ["AI", "Analytics", "JavaScript", "TypeScript"],
    href: "/case-studies/enterprise-linkedin-voice-analytics.html",
  },
  {
    title: "SDR Automation Application",
    year: "2026",
    description:
      "Built SDRBase, a HubSpot-backed RevOps platform that unifies prospecting, sequence workflows, AI news signals, and forecasting into one operating dashboard.",
    tags: ["JavaScript", "TypeScript", "SQL", "AI"],
    href: "/case-studies/sdr-automation-application.html",
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
    "I take on a small number of engagements at a time. If anything below maps to where you are stuck or where you are headed, send a note.",
  ctaPrompt: "Have a different problem?",
  ctaSubcopy:
    "Tell me what you are working on. If it is not a fit, I will refer you to someone who is.",
  ctaButton: "Contact",
};

export const services: Service[] = [
  {
    title: "Startup GTM and growth strategy",
    description:
      "For founders who need clearer ICPs, tighter positioning, better sales motion, and useful experiments.",
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
      "For companies that need sharp research, market mapping, competitive analysis, or execution capacity.",
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
      title: "Why live music needs better social infrastructure",
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
      title: "Taste is a growth function",
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
