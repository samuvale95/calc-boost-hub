import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Loader2 } from "lucide-react";
import { LEGAL, FOUNDATION } from "@/config/legal";

interface LegalPageProps {
  kind: "privacy" | "cookie";
}

/**
 * /privacy-policy and /cookie-policy. The documents live on iubenda (kept
 * up to date by Fondazione Dravet), so these routes just forward there.
 * Keeping our own routes means links already in the app — e.g. the consent
 * checkbox in CompleteProfileForm — keep working whatever the iubenda URL.
 */
const LegalPage = ({ kind }: LegalPageProps) => {
  const { t } = useTranslation();
  const url = kind === "privacy" ? LEGAL.PRIVACY_POLICY_URL : LEGAL.COOKIE_POLICY_URL;

  useEffect(() => {
    if (url) window.location.replace(url);
  }, [url]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        {url ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <>
            <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-3">{t(`legal.${kind}Title`)}</h1>
            <p className="text-muted-foreground">
              {t("legal.comingSoon")}{" "}
              <a href={`mailto:${FOUNDATION.email}`} className="text-primary hover:underline">
                {FOUNDATION.email}
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LegalPage;
