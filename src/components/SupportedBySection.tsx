import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import logoDravet from "@/assets/logo-dravet.png";
import logoCattolica from "@/assets/fondazione-cattolica.svg";
import logoJazz from "@/assets/logo-jazz-pharma.png";
import logoUcb from "@/assets/ubc_premiere.svg";
import logoLundbeck from "@/assets/lundbeck.svg";
import logoBiocodex from "@/assets/logo-biocodex.png";
import logoAoui from "@/assets/aoui.png";
import logoUnipv from "@/assets/logo-unipv.svg";
import logoNecker from "@/assets/logo-necker.png";

// Clinical/academic partners of the D-DAND working group (deck slide 2).
const PARTNER_LOGOS = [
  { src: logoAoui, alt: "AOUI Verona" },
  { src: logoUnipv, alt: "Università degli Studi di Pavia" },
  { src: logoNecker, alt: "Hôpital Necker-Enfants malades" },
];

// Unrestricted-grant sponsors, in the order given by Fondazione Dravet.
const GRANT_LOGOS = [
  { src: logoJazz, alt: "Jazz Pharmaceuticals" },
  { src: logoUcb, alt: "UCB" },
  { src: logoLundbeck, alt: "Lundbeck" },
  { src: logoBiocodex, alt: "Biocodex" },
];

/**
 * "Supported by" acknowledgements (Fondazione Dravet feedback,
 * "Sito DAND note Dravet.pdf" p. 3). Texts must stay as agreed with the
 * Fondazione.
 */
export const SupportedBySection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(316,91%,40%)] mb-3">
          {t("supportedBy.eyebrow")}
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8">{t("supportedBy.title")}</h2>
        <img
          src={logoDravet}
          alt="Fondazione Dravet ETS"
          className="mx-auto h-24 md:h-28 w-auto mb-8 select-none"
          draggable={false}
        />
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 mb-12">
          {PARTNER_LOGOS.map(({ src, alt }) => (
            <li key={alt}>
              <img src={src} alt={alt} title={alt} className="h-10 md:h-12 w-auto max-w-[180px] object-contain select-none" draggable={false} />
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-10">
          <p className="flex items-start gap-3 text-lg text-foreground leading-relaxed max-w-2xl">
            <Heart className="w-5 h-5 mt-1.5 flex-shrink-0 text-[hsl(316,91%,40%)]" />
            <span className="text-left">{t("supportedBy.lollo")}</span>
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">{t("supportedBy.alsoBy")}</p>
            <img
              src={logoCattolica}
              alt="Fondazione Cattolica Assicurazioni"
              className="h-14 md:h-16 w-auto select-none"
              draggable={false}
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{t("supportedBy.grants")}</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {GRANT_LOGOS.map(({ src, alt }) => (
                <li key={alt}>
                  <img src={src} alt={alt} className="h-9 md:h-10 w-auto max-w-[160px] object-contain select-none" draggable={false} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
