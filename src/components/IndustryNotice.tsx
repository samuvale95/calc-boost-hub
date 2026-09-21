import { Building2 } from "lucide-react";

const CONTACT_EMAIL = import.meta.env.VITE_DAND_CONTACT_EMAIL || "fondazionedravet@gmail.com";

/**
 * Banner for pharmaceutical companies / CROs / sponsored clinical trials.
 * Text as agreed with Fondazione Dravet ETS (email "Sito e preventivo",
 * 17/09/2026) — do not paraphrase without their sign-off.
 */
export const IndustryNotice = () => {
  return (
    <div className="bg-muted/60 border-y">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start gap-3 max-w-3xl mx-auto text-sm">
          <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Industria / Pharma / CRO / Clinical Trial sponsorizzati.</strong>{" "}
            L'utilizzo della DAND Scale da parte di aziende farmaceutiche, CRO, nell'ambito di clinical
            trial sponsorizzati o per altre finalità commerciali è soggetto a specifica richiesta a
            Fondazione Dravet ETS. Contatto:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
            . Fondazione Dravet ETS valuterà la richiesta e contatterà il richiedente per concordare le
            modalità di utilizzo e di eventuale collaborazione.
          </p>
        </div>
      </div>
    </div>
  );
};
