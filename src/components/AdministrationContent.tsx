import { useTranslation } from "react-i18next";
import { Crosshair, ShieldCheck, FileDown, type LucideIcon } from "lucide-react";

// Card palette from the Fondazione's mock-up (orange / green / magenta).
const CARDS: { key: string; icon: LucideIcon; accent: string; bg: string; title: string }[] = [
  { key: "accuracy", icon: Crosshair, accent: "#F08300", bg: "#FFF5E6", title: "#9A4E00" },
  { key: "privacy", icon: ShieldCheck, accent: "#66AB3C", bg: "#EFF8E9", title: "#346318" },
  { key: "practical", icon: FileDown, accent: "#A82D7D", bg: "#FCEEF7", title: "#781A57" },
];

/** "Paper or digital administration" content, shown as an accordion item in the home FAQ (Hero). */
export const AdministrationContent = () => {
  const { t } = useTranslation();

  return (
    <div className="px-2 py-1 space-y-5">
      <p className="text-sm text-muted-foreground leading-relaxed">{t("administration.subtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {CARDS.map(({ key, icon: Icon, accent, bg, title }) => (
          <article
            key={key}
            className="flex flex-col items-center text-center rounded-xl border-t-4 p-5 shadow-sm"
            style={{ backgroundColor: bg, borderTopColor: accent }}
          >
            <div
              aria-hidden="true"
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md"
              style={{ backgroundColor: accent }}
            >
              <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
            </div>
            <h3 className="text-base font-extrabold leading-snug mb-2" style={{ color: title }}>
              {t(`administration.cards.${key}.title`)}
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{t(`administration.cards.${key}.body`)}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
