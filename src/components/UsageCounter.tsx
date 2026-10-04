import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { Calculator, Download } from "lucide-react";
import { eventService, PublicStats } from "@/services/eventService";

/**
 * Optional public counter (DAND Scale plan, point 6: "Contatore pubblico
 * opzionale in homepage"). Aggregate-only — no per-user data, no auth.
 * Renders nothing while loading or if the numbers are both zero, so an
 * unconfigured/fresh backend doesn't show an awkward "0 volte" banner.
 */
export const UsageCounter = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    eventService
      .getPublicStats()
      .then(setStats)
      .catch((error) => console.warn("Impossibile caricare le statistiche pubbliche:", error));
  }, []);

  if (!stats || (stats.calculator_uses === 0 && stats.scale_downloads === 0)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 mb-10 text-base md:text-lg text-foreground">
      {stats.calculator_uses > 0 && (
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-[hsl(316,91%,40%)]" />
          <Trans
            i18nKey="usageCounter.calculatorUses"
            values={{ count: stats.calculator_uses }}
            components={{ strong: <strong className="mx-1 text-3xl md:text-4xl font-extrabold text-[hsl(316,91%,40%)]" /> }}
          />
        </div>
      )}
      {stats.scale_downloads > 0 && (
        <div className="flex items-center gap-3">
          <Download className="h-6 w-6 text-[hsl(95,87%,34%)]" />
          <Trans
            i18nKey="usageCounter.scaleDownloads"
            values={{ count: stats.scale_downloads }}
            components={{ strong: <strong className="mx-1 text-3xl md:text-4xl font-extrabold text-[hsl(95,87%,34%)]" /> }}
          />
        </div>
      )}
    </div>
  );
};
