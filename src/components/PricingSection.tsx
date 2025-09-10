import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, FileText, Calculator } from "lucide-react";
import { RegistrationSection } from "./RegistrationSection";

export const PricingSection = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<'pdf' | 'annuale' | null>(null);

  const handlePdfPurchase = () => {
    setSelectedSubscriptionType('pdf');
    setIsRegistrationOpen(true);
  };

  const handleSubscription = () => {
    setSelectedSubscriptionType('annuale');
    setIsRegistrationOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
    setSelectedSubscriptionType(null);
  };

  return (
    <section id="pricing" className="pt-6 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Scegli la Tua Opzione
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Accedi ai nostri strumenti di calcolo nel modo che preferisci
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* PDF Option */}
          <Card className="relative border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-primary rounded-full">
                  <FileText className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-2">Guida PDF</CardTitle>
              <CardDescription className="text-base">
                Scarica la guida completa con tutti i calcoli e formule
              </CardDescription>
              <div className="flex items-center justify-center mt-4">
                <span className="text-3xl font-bold">€10</span>
                <span className="text-muted-foreground ml-2">una tantum</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Guida completa in formato PDF</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Formule e esempi pratici</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Download immediato</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Accesso illimitato</span>
                </li>
              </ul>
              <Button 
                onClick={handlePdfPurchase}
                className="w-full" 
                variant="outline"
                size="lg"
              >
                Acquista PDF
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Option */}
          <Card className="relative border-2 border-accent hover:border-accent/80 transition-all duration-300 hover:shadow-accent-glow">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-accent">
              Più Popolare
            </Badge>
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-accent rounded-full">
                  <Calculator className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-2">Tool Interattivo</CardTitle>
              <CardDescription className="text-base">
                Accesso completo al tool di calcolo avanzato
              </CardDescription>
              <div className="flex items-center justify-center mt-4">
                <span className="text-3xl font-bold">€10</span>
                <span className="text-muted-foreground ml-2">all'anno</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Tool di calcolo interattivo</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Aggiornamenti automatici</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Supporto prioritario</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Esportazione risultati</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span>Accesso da qualsiasi dispositivo</span>
                </li>
              </ul>
              <Button 
                onClick={handleSubscription}
                className="w-full" 
                variant="accent"
                size="lg"
              >
                Inizia Abbonamento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationSection
        isOpen={isRegistrationOpen}
        onClose={handleCloseRegistration}
        subscriptionType={selectedSubscriptionType}
      />
    </section>
  );
};