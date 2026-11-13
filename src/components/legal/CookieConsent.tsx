import { useEffect } from "react";
import { LEGAL } from "@/config/legal";

/**
 * Loads iubenda's Cookie Solution (consent banner + preferences panel)
 * once, if configured. The banner itself and its texts are managed by
 * Fondazione Dravet on iubenda.
 */
export const CookieConsent = () => {
  useEffect(() => {
    const src = LEGAL.CONSENT_SCRIPT_URL;
    if (!src || document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }, []);
  return null;
};
