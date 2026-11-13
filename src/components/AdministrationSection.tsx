import { useTranslation } from "react-i18next";
import { Crosshair, ShieldCheck, FileDown, type LucideIcon } from "lucide-react";

// Card palette from the Fondazione's mock-up (orange / green / magenta).
const CARDS: { key: string; icon: LucideIcon; accent: string; bg: string; title: string }[] = [
  { key: "accuracy", icon: Crosshair, accent: "#F08300", bg: "#FFF5E6", title: "#9A4E00" },
  { key: "privacy", icon: ShieldCheck, accent: "#66AB3C", bg: "#EFF8E9", title: "#346318" },
  { key: "practical", icon: FileDown, accent: "#A82D7D", bg: "#FCEEF7", title: "#781A57" },
];

/** "Paper or digital administration" home section. */
export const AdministrationSection = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="administration-title" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(316,91%,40%)] mb-3">
            {t("administration.eyebrow")}
          </p>
          <h2 id="administration-title" className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            {t("administration.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("administration.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CARDS.map(({ key, icon: Icon, accent, bg, title }) => (
            <article
              key={key}
              className="group flex flex-col items-center text-center rounded-2xl border-t-[6px] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: bg, borderTopColor: accent }}
            >
              <div
                aria-hidden="true"
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: accent }}
              >
                <Icon className="w-10 h-10 text-white" strokeWidth={2.2} />
              </div>
              <h3 className="text-2xl font-extrabold leading-snug mb-3" style={{ color: title }}>
                {t(`administration.cards.${key}.title`)}
              </h3>
              <p className="text-base text-foreground/80 leading-relaxed">{t(`administration.cards.${key}.body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
