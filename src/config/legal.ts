// Legal documents and cookie consent, managed by Fondazione Dravet ETS on
// iubenda. Everything comes from env vars so the links can be filled in on
// Vercel without a code change. Until they are set, /privacy-policy and
// /cookie-policy show a "being prepared" page and no consent banner loads.
export const LEGAL = {
  /** Public iubenda URL of the privacy policy, e.g. https://www.iubenda.com/privacy-policy/12345678 */
  PRIVACY_POLICY_URL: import.meta.env.VITE_IUBENDA_PRIVACY_URL as string | undefined,
  /** Public iubenda URL of the cookie policy, e.g. https://www.iubenda.com/privacy-policy/12345678/cookie-policy */
  COOKIE_POLICY_URL: import.meta.env.VITE_IUBENDA_COOKIE_URL as string | undefined,
  /** Script URL of the iubenda Cookie Solution embed (the src="..." in the snippet iubenda gives). */
  CONSENT_SCRIPT_URL: import.meta.env.VITE_IUBENDA_CONSENT_SCRIPT_URL as string | undefined,
} as const;

// Foundation details from its own letterhead (email 05/08/2026).
export const FOUNDATION = {
  name: "Fondazione Dravet ETS",
  address: "Via Don Enrico Tazzoli 12, 37121 Verona",
  taxCode: "90018630237",
  email: "fondazionedravet@gmail.com",
} as const;

type IubendaWindow = Window & { _iub?: { cs?: { api?: { openPreferences?: () => void } } } };

/**
 * Opens iubenda's consent preferences panel. Returns false when the
 * Cookie Solution is not loaded (not configured yet, or blocked).
 */
export const openCookiePreferences = (): boolean => {
  const open = (window as IubendaWindow)._iub?.cs?.api?.openPreferences;
  if (typeof open !== "function") return false;
  open();
  return true;
};
