import { seo, SITE_ORIGIN } from "@/data/seo";
import { site } from "@/data/content";

/**
 * Homepage structured data for search and generative engines.
 * Rendered in the document so prerendered HTML includes JSON-LD.
 */
export function SeoSchema() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: site.name,
        description: seo.description,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_ORIGIN}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_ORIGIN}/#person`,
        name: site.name,
        url: SITE_ORIGIN,
        image: `${SITE_ORIGIN}/images/linkedin-headshot-crop.png`,
        jobTitle: seo.jobTitle,
        description: seo.description,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Washington",
          addressRegion: "DC",
          addressCountry: "US",
        },
        knowsAbout: [...seo.knowsAbout],
        sameAs: [...seo.sameAs],
        worksFor: [
          {
            "@type": "Organization",
            name: "Nexus Consulting",
            url: "https://nxsconsultants.com",
          },
          {
            "@type": "Organization",
            name: "JamBase",
            url: "https://data.jambase.com",
          },
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_ORIGIN}/#services`,
        name: "Sam Loiterstein: fractional product and AI systems",
        url: `${SITE_ORIGIN}/#offer`,
        description:
          "Fractional product work for CROs and COOs: revenue execution systems, AI inside governed workflows, and program infrastructure for mission-driven teams.",
        provider: { "@id": `${SITE_ORIGIN}/#person` },
        areaServed: "US",
        serviceType: [
          "Fractional product leadership",
          "AI operations",
          "Revenue operations",
          "GTM systems",
          "Nonprofit technology",
          "Custom internal tools",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
