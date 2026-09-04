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
        name: "Sam Loiterstein: AI workflows and GTM as a Service",
        url: `${SITE_ORIGIN}/#engagements`,
        description:
          "Engagements covering AI expertise, workflow design, and GTM as a Service for startups and community-facing organizations.",
        provider: { "@id": `${SITE_ORIGIN}/#person` },
        areaServed: "US",
        serviceType: [
          "GTM as a Service",
          "AI workflow design",
          "Revenue operations",
          "Product strategy",
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
