import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";

const CONTACT_EMAIL = import.meta.env.VITE_DAND_CONTACT_EMAIL || "fondazionedravet@gmail.com";

/**
 * Banner for pharmaceutical companies / CROs / sponsored clinical trials.
 * Text as agreed with Fondazione Dravet ETS (email "Sito e preventivo",
 * 17/09/2026) — the IT/EN/FR translations under src/locales (each
 * common.json's "industryNotice" key) must stay a faithful rendering of
 * the Italian original; do not paraphrase without their sign-off.
 */
export const IndustryNotice = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-muted/60 border-y">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start gap-3 max-w-3xl mx-auto text-sm">
          <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">{t('industryNotice.title')}</strong>{" "}
            {t('industryNotice.body')}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
            . {t('industryNotice.afterContact')}
          </p>
        </div>
      </div>
    </div>
  );
};
