import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, FileText, Calculator, Download, Users, ShieldCheck } from "lucide-react";
import { LoginSection } from "./LoginSection";

const GREEN = "hsl(95,87%,34%)";
const MAGENTA = "hsl(316,91%,40%)";

/**
 * Replaces the old paid PricingSection: access to the DAND Scale, the
 * manual and the calculator is now free, gated only by registration (DAND
 * Scale plan, point 4/5) — no payment involved.
 */
export const AccessSection = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <section id="access" className="py-20 bg-[#fff4fc] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[hsl(95,87%,34%,0.06)] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[hsl(316,91%,40%,0.06)] blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(316,91%,40%)] mb-3">
            Accesso alla scala
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            Registrati per accedere
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            L'uso clinico, accademico e di ricerca non commerciale della DAND Scale è gratuito.
            Basta una registrazione per scaricare la scala, il manuale e usare il calcolatore automatico.
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-2xl border-2 border-[hsl(316,91%,40%)] bg-white shadow-lg overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[hsl(316,91%,40%)] to-[hsl(316,91%,55%)]" />
          <div className="p-8 flex flex-col gap-6">
            <ul className="space-y-3">
              {[
                { icon: FileText, label: "Scala D-DAND in formato PDF" },
                { icon: Download, label: "Manuale d'uso incluso" },
                { icon: Calculator, label: "Calcolatore automatico dei 25 outcome" },
                { icon: ShieldCheck, label: "Nessun dato del paziente conservato sul server" },
                { icon: Users, label: "Registrazione individuale, senza password condivisa" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[hsl(316,91%,40%,0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-[hsl(316,91%,40%)]" />
                  </span>
                  <span className="text-sm text-foreground leading-snug">{label}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => setIsLoginOpen(true)}
              size="lg"
              className="w-full bg-[hsl(316,91%,40%)] hover:bg-[hsl(316,91%,34%)] text-white font-semibold rounded-xl"
            >
              Registrati / Accedi
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Accesso gratuito · Nessuna password da ricordare · Approvazione rapida
        </p>
      </div>

      <LoginSection isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </section>
  );
};
