// ISO 3166-1 alpha-2 codes of the countries offered in the registration form.
// Names are not hardcoded: they come from the browser's Intl.DisplayNames in
// the interface language (see countryName below).
export const COUNTRY_CODES = [
  "AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ",
  "BT", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "CF", "TD", "CL", "CN", "CO", "KM",
  "CG", "CD", "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ",
  "ET", "FJ", "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN", "GW", "GY", "HT", "HN", "HU", "IS",
  "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KP", "KR", "XK", "KW", "KG", "LA",
  "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX", "FM",
  "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NZ", "NI", "NE", "NG", "MK", "NO", "OM", "PK",
  "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA", "RO", "RU", "RW", "KN", "LC", "VC", "WS", "SM", "ST",
  "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA", "SS", "ES", "LK", "SD", "SR", "SE", "CH", "SY",
  "TW", "TJ", "TZ", "TH", "TL", "TG", "TO", "TT", "TN", "TR", "TM", "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ",
  "VU", "VA", "VE", "VN", "YE", "ZM", "ZW",
] as const;

// Intl names PS "Palestinian Territories"; the site (and the Fondazione) use "Palestine".
const NAME_OVERRIDES: Record<string, Record<string, string>> = {
  PS: { it: "Palestina", en: "Palestine", fr: "Palestine" },
  XK: { it: "Kosovo", en: "Kosovo", fr: "Kosovo" },
};

/** Country name in the given language (falls back to the ISO code). */
export const countryName = (code: string, lang: string): string => {
  const base = lang.split("-")[0];
  const override = NAME_OVERRIDES[code]?.[base] ?? NAME_OVERRIDES[code]?.en;
  if (override) return override;
  try {
    return new Intl.DisplayNames([base], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

/**
 * The value stored in the backend for a country: always the Italian name,
 * whatever the interface language, so the admin statistics don't split the
 * same country across languages.
 */
export const countryStoredName = (code: string): string => countryName(code, "it");

/** Countries sorted alphabetically by their name in the given language. */
export const countryOptions = (lang: string): { code: string; name: string }[] =>
  COUNTRY_CODES.map((code) => ({ code, name: countryName(code, lang) })).sort((a, b) =>
    a.name.localeCompare(b.name, lang.split("-")[0])
  );
