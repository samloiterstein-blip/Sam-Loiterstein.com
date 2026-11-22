/**
 * SEO metadata for the personal site.
 * Keep titles and descriptions in sync with public/llms.txt and index.html.
 */

export const SITE_ORIGIN = "https://sam-loiterstein.com" as const;

export const seo = {
  title: "Sam Loiterstein | Fractional product leadership for AI and revenue systems",
  description:
    "Fractional product lead Sam Loiterstein helps revenue and operations leaders make the tools they already use work together, with AI inside the workflows those teams run.",
  keywords: [
    "Sam Loiterstein",
    "fractional product leadership",
    "AI operations",
    "revenue operations",
    "GTM systems",
    "nonprofit technology",
    "custom internal tools",
    "Washington DC",
  ],
  canonical: `${SITE_ORIGIN}/`,
  ogImage: `${SITE_ORIGIN}/og.png`,
  ogImageAlt: "Sam Loiterstein, fractional product and AI systems for revenue and operations",
  twitterHandle: undefined as string | undefined,
  locale: "en_US",
  llmsTxt: `${SITE_ORIGIN}/llms.txt`,
  llmsFullTxt: `${SITE_ORIGIN}/llms-full.txt`,
  sameAs: [
    "https://www.linkedin.com/in/sam-loiterstein",
    "https://substack.com/@sloiterstein",
    "https://sloiterstein.substack.com",
    "https://github.com/samloiterstein-blip",
    "https://nxsconsultants.com",
  ],
  jobTitle: "Fractional product and AI systems lead",
  knowsAbout: [
    "AI operations",
    "Fractional product leadership",
    "Revenue operations",
    "GTM systems",
    "Nonprofit technology",
    "Custom internal tools",
    "CRM systems",
    "HubSpot",
    "Salesforce",
    "Workflow design",
  ],
} as const;
