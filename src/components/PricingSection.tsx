import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  FileText,
  Calculator,
  Download,
  Infinity,
  Zap,
  BarChart3,
  RefreshCw,
  Globe,
} from "lucide-react";
import { RegistrationSection } from "./RegistrationSection";
import { PAYMENT_AMOUNTS } from "@/config/paypal";

const GREEN = "hsl(95,87%,34%)";
const MAGENTA = "hsl(316,91%,40%)";

export const PricingSection = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<
    "pdf" | "annuale" | null
  >(null);

  const handlePdfPurchase = () => {
    setSelectedSubscriptionType("pdf");
    setIsRegistrationOpen(true);
  };

  const handleSubscription = () => {
    setSelectedSubscriptionType("annuale");
    setIsRegistrationOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
    setSelectedSubscriptionType(null);
  };

  return (
    <section id="pricing" className="py-20 bg-[#fff4fc] relative overflow-hidden">
      {/* Sfondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[hsl(95,87%,34%,0.06)] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[hsl(316,91%,40%,0.06)] blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(316,91%,40%)] mb-3">
            Accesso alla scala
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            Scegli il tuo piano
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Usa la D-DAND in formato cartaceo o accedi al test interattivo con calcolo automatico dei punteggi.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">

          {/* ── CARD PDF ── */}
          <div className="relative rounded-2xl border-2 border-border bg-white shadow-sm hover:shadow-md hover:border-[hsl(95,87%,34%,0.5)] transition-all duration-300 flex flex-col overflow-hidden">
            {/* Striscia colore top */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[hsl(95,87%,34%)] to-[hsl(95,87%,50%)]" />

            <div className="p-8 flex flex-col gap-6 flex-1">
              {/* Icon + titolo */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(95,87%,34%,0.1)] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[hsl(95,87%,34%)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Kit D-DAND PDF</h3>
                  <p className="text-sm text-muted-foreground">Scala in formato stampabile</p>
                </div>
              </div>

              {/* Prezzo */}
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-foreground">
                  €{PAYMENT_AMOUNTS.PDF}
                </span>
                <span className="text-muted-foreground mb-1.5 text-sm">una tantum</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {[
                  { icon: FileText, label: "Scala D-DAND in formato PDF" },
                  { icon: Download, label: "Manuale d'uso incluso" },
                  { icon: BarChart3, label: "Formule e tabelle per il calcolo manuale dei 25 outcome" },
                  { icon: Zap, label: "Download immediato" },
                  { icon: Infinity, label: "Accesso illimitato" },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[hsl(95,87%,34%,0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-3 h-3 text-[hsl(95,87%,34%)]" />
                    </span>
                    <span className="text-sm text-foreground leading-snug">{label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={handlePdfPurchase}
                size="lg"
                className="w-full bg-[hsl(95,87%,34%)] hover:bg-[hsl(95,87%,28%)] text-white font-semibold rounded-xl"
              >
                Acquista PDF
              </Button>
            </div>
          </div>

          {/* ── CARD TEST INTERATTIVO ── */}
          <div className="relative rounded-2xl border-2 border-[hsl(316,91%,40%)] bg-white shadow-lg flex flex-col overflow-hidden">
            {/* Striscia colore top */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[hsl(316,91%,40%)] to-[hsl(316,91%,55%)]" />

            {/* Badge */}
            <div className="absolute top-5 right-5">
              <Badge className="bg-[hsl(316,91%,40%)] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                Consigliato
              </Badge>
            </div>

            <div className="p-8 flex flex-col gap-6 flex-1">
              {/* Icon + titolo */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(316,91%,40%,0.1)] flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-[hsl(316,91%,40%)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Test Interattivo</h3>
                  <p className="text-sm text-muted-foreground">Calcolo automatico dei punteggi</p>
                </div>
              </div>

              {/* Prezzo */}
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-foreground">
                  €{PAYMENT_AMOUNTS.SUBSCRIPTION}
                </span>
                <span className="text-muted-foreground mb-1.5 text-sm">all'anno</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-[hsl(316,91%,40%,0.15)]" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {[
                  { label: "Tutto il contenuto del Kit PDF" },
                  { label: "Test online da qualsiasi dispositivo" },
                  { label: "Calcolo automatico dei 25 outcome" },
                  { label: "Risultati più precisi tramite formule dirette" },
                  { label: "Report completo esportabile in PDF" },
                  { label: "Aggiornamenti inclusi per tutta la durata" },
                ].map(({ label }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[hsl(316,91%,40%,0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-3 h-3 text-[hsl(316,91%,40%)]" />
                    </span>
                    <span className="text-sm text-foreground leading-snug">{label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={handleSubscription}
                size="lg"
                className="w-full bg-[hsl(316,91%,40%)] hover:bg-[hsl(316,91%,34%)] text-white font-semibold rounded-xl"
              >
                Inizia Abbonamento
              </Button>
            </div>
          </div>
        </div>

        {/* Nota in fondo */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Pagamento sicuro · Accesso immediato dopo l'acquisto · Supporto incluso
        </p>
      </div>

      <RegistrationSection
        isOpen={isRegistrationOpen}
        onClose={handleCloseRegistration}
        subscriptionType={selectedSubscriptionType}
      />
    </section>
  );
};
