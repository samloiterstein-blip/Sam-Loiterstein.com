/**
 * SEO and GEO metadata for the personal site.
 * Keep titles and descriptions in sync with public/llms.txt and public/llms-full.txt.
 */

export const SITE_ORIGIN = "https://sam-loiterstein.com" as const;

export const seo = {
  title: "Sam Loiterstein | AI Expertise, Workflows, and GTM as a Service",
  description:
    "Sam Loiterstein designs AI-powered workflows and GTM as a Service for community-facing companies. Product, RevOps, and go-to-market systems based in Washington, DC.",
  keywords: [
    "Sam Loiterstein",
    "AI expertise",
    "AI workflows",
    "GTM as a Service",
    "go-to-market",
    "RevOps",
    "product systems",
    "Nexus Consulting",
    "Washington DC",
  ],
  canonical: SITE_ORIGIN,
  ogImage: `${SITE_ORIGIN}/og.png`,
  ogImageAlt: "Sam Loiterstein: AI expertise, workflows, and GTM as a Service",
  twitterHandle: undefined as string | undefined,
  locale: "en_US",
  llmsTxt: `${SITE_ORIGIN}/llms.txt`,
  llmsFullTxt: `${SITE_ORIGIN}/llms-full.txt`,
  sameAs: [
    "https://www.linkedin.com/in/sam-loiterstein",
    "https://substack.com/@sloiterstein",
    "https://sloiterstein.substack.com",
    "https://nxsconsultants.com",
  ],
  jobTitle: "Founder, AI and GTM systems operator",
  knowsAbout: [
    "AI expertise",
    "AI workflows",
    "GTM as a Service",
    "Go-to-market strategy",
    "Revenue operations",
    "RevOps",
    "Product strategy",
    "Sales infrastructure",
    "CRM systems",
    "HubSpot",
    "Salesforce",
    "Community programs",
    "Live music technology",
  ],
} as const;
