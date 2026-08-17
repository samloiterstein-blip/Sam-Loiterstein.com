import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

type NamedCount = { name: string; count: number };

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO numeric (world-atlas) → ISO alpha-2
const NUMERIC_TO_ALPHA2: Record<string, string> = {
  "004": "AF", "008": "AL", "012": "DZ", "020": "AD", "024": "AO", "028": "AG",
  "032": "AR", "036": "AU", "040": "AT", "048": "BH", "050": "BD", "051": "AM",
  "056": "BE", "064": "BT", "068": "BO", "070": "BA", "072": "BW", "076": "BR",
  "084": "BZ", "090": "SB", "096": "BN", "100": "BG", "104": "MM", "108": "BI",
  "112": "BY", "116": "KH", "120": "CM", "124": "CA", "140": "CF", "144": "LK",
  "148": "TD", "152": "CL", "156": "CN", "158": "TW", "170": "CO", "174": "KM",
  "178": "CG", "180": "CD", "188": "CR", "191": "HR", "192": "CU", "196": "CY",
  "203": "CZ", "204": "BJ", "208": "DK", "214": "DO", "218": "EC", "222": "SV",
  "226": "GQ", "231": "ET", "232": "ER", "233": "EE", "242": "FJ", "246": "FI",
  "250": "FR", "258": "PF", "262": "DJ", "266": "GA", "268": "GE", "270": "GM",
  "275": "PS", "276": "DE", "288": "GH", "300": "GR", "320": "GT", "324": "GN",
  "328": "GY", "332": "HT", "340": "HN", "348": "HU", "352": "IS", "356": "IN",
  "360": "ID", "364": "IR", "368": "IQ", "372": "IE", "376": "IL", "380": "IT",
  "384": "CI", "388": "JM", "392": "JP", "398": "KZ", "400": "JO", "404": "KE",
  "408": "KP", "410": "KR", "414": "KW", "417": "KG", "418": "LA", "422": "LB",
  "426": "LS", "428": "LV", "430": "LR", "434": "LY", "440": "LT", "442": "LU",
  "450": "MG", "454": "MW", "458": "MY", "462": "MV", "466": "ML", "470": "MT",
  "478": "MR", "480": "MU", "484": "MX", "496": "MN", "498": "MD", "499": "ME",
  "504": "MA", "508": "MZ", "512": "OM", "516": "NA", "524": "NP", "528": "NL",
  "540": "NC", "548": "VU", "554": "NZ", "558": "NI", "562": "NE", "566": "NG",
  "578": "NO", "586": "PK", "591": "PA", "598": "PG", "600": "PY", "604": "PE",
  "608": "PH", "616": "PL", "620": "PT", "624": "GW", "626": "TL", "630": "PR",
  "634": "QA", "642": "RO", "643": "RU", "646": "RW", "682": "SA", "686": "SN",
  "688": "RS", "694": "SL", "702": "SG", "703": "SK", "704": "VN", "705": "SI",
  "706": "SO", "710": "ZA", "716": "ZW", "724": "ES", "728": "SS", "729": "SD",
  "740": "SR", "748": "SZ", "752": "SE", "756": "CH", "760": "SY", "762": "TJ",
  "764": "TH", "768": "TG", "780": "TT", "784": "AE", "788": "TN", "792": "TR",
  "795": "TM", "800": "UG", "804": "UA", "807": "MK", "818": "EG", "826": "GB",
  "834": "TZ", "840": "US", "854": "BF", "858": "UY", "860": "UZ", "862": "VE",
  "887": "YE", "894": "ZM",
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  IL: "Israel",
  AE: "United Arab Emirates",
  SG: "Singapore",
  NZ: "New Zealand",
  ZA: "South Africa",
  NG: "Nigeria",
  KE: "Kenya",
  EG: "Egypt",
  TR: "Turkey",
  PL: "Poland",
  PT: "Portugal",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  PH: "Philippines",
  TH: "Thailand",
  VN: "Vietnam",
  ID: "Indonesia",
  MY: "Malaysia",
  PK: "Pakistan",
  BD: "Bangladesh",
  SA: "Saudi Arabia",
  RU: "Russia",
  UA: "Ukraine",
};

type Props = {
  countries: NamedCount[];
  cities: NamedCount[];
};

export function LocationMap({ countries, cities }: Props) {
  const byCode = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of countries) {
      const code = row.name.trim().toUpperCase();
      if (!code || code === "(UNKNOWN)") continue;
      map.set(code, (map.get(code) || 0) + row.count);
    }
    return map;
  }, [countries]);

  const max = useMemo(
    () => Math.max(1, ...[...byCode.values()], 1),
    [byCode]
  );

  const ranked = useMemo(
    () =>
      [...byCode.entries()]
        .map(([code, count]) => ({
          code,
          count,
          name: COUNTRY_NAMES[code] || code,
        }))
        .sort((a, b) => b.count - a.count),
    [byCode]
  );

  function fillFor(code: string | undefined) {
    if (!code) return "#e8ebe6";
    const count = byCode.get(code);
    if (!count) return "#e8ebe6";
    const t = Math.min(1, count / max);
    // sage scale
    const lightness = 78 - t * 42;
    return `hsl(140 28% ${lightness}%)`;
  }

  return (
    <section className="border border-ink-200/70 bg-white/70 p-5">
      <h3 className="text-sm font-medium text-ink-900">Visitor locations</h3>
      <p className="mt-1 text-sm text-ink-500">
        Country shading from session location. Cities listed beside the map.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden border border-ink-100 bg-[#f4f6f3]">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 155, center: [0, 10] }}
            width={800}
            height={420}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const numeric = String(geo.id).padStart(3, "0");
                    const code = NUMERIC_TO_ALPHA2[numeric];
                    const count = code ? byCode.get(code) || 0 : 0;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillFor(code)}
                        stroke="#d5dbd2"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            outline: "none",
                            fill: code && count ? "#324f3c" : "#dfe4db",
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="space-y-5">
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] text-ink-500">
              Countries
            </h4>
            {ranked.length === 0 ? (
              <p className="mt-2 text-sm text-ink-500">No country data yet</p>
            ) : (
              <ul className="mt-2 max-h-40 space-y-1.5 overflow-auto text-sm">
                {ranked.slice(0, 12).map((row) => (
                  <li
                    key={row.code}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="truncate text-ink-700">
                      {row.name}{" "}
                      <span className="text-ink-400">({row.code})</span>
                    </span>
                    <span className="tabular-nums text-ink-500">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] text-ink-500">
              Cities
            </h4>
            {cities.filter((c) => c.name !== "(unknown)").length === 0 ? (
              <p className="mt-2 text-sm text-ink-500">No city data yet</p>
            ) : (
              <ul className="mt-2 max-h-40 space-y-1.5 overflow-auto text-sm">
                {cities
                  .filter((c) => c.name !== "(unknown)")
                  .slice(0, 12)
                  .map((row) => (
                    <li
                      key={row.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate text-ink-700">{row.name}</span>
                      <span className="tabular-nums text-ink-500">
                        {row.count}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
