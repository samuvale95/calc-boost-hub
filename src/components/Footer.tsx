import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FOUNDATION, openCookiePreferences } from "@/config/legal";

/**
 * Site-wide footer (Fondazione Dravet feedback, "Sito DAND note Dravet.pdf"
 * p. 1): Privacy Policy, Cookie Policy and "change cookie preferences".
 */
export const Footer = () => {
  const { t } = useTranslation();

  const handlePreferences = (e: React.MouseEvent) => {
    // iubenda also binds this class itself; if its script isn't there,
    // fall back to the cookie policy page.
    if (openCookiePreferences()) e.preventDefault();
  };

  const linkClass = "hover:text-foreground hover:underline transition-colors";

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} {FOUNDATION.name} · {t("footer.taxCode")} {FOUNDATION.taxCode}
        </p>
        <nav aria-label={t("footer.legalNav")} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/privacy-policy" className={linkClass}>
            {t("footer.privacy")}
          </Link>
          <Link to="/cookie-policy" className={linkClass}>
            {t("footer.cookie")}
          </Link>
          <a href="/cookie-policy" onClick={handlePreferences} className={`iubenda-cs-preferences-link ${linkClass}`}>
            {t("footer.cookiePreferences")}
          </a>
        </nav>
      </div>
    </footer>
  );
};
