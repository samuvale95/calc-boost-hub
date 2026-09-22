import { useEffect, useState } from "react";
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
    <div className="flex flex-wrap items-center justify-center gap-6 py-6 text-sm text-muted-foreground">
      {stats.calculator_uses > 0 && (
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Il calcolatore è stato usato <strong className="text-foreground">{stats.calculator_uses}</strong> volte
        </div>
      )}
      {stats.scale_downloads > 0 && (
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Scala scaricata <strong className="text-foreground">{stats.scale_downloads}</strong> volte
        </div>
      )}
    </div>
  );
};
