import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// PayPal hosted donate button, provided by Fondazione Dravet ETS (email
// "Sito e preventivo", 17/09/2026). Do not swap this id without the
// Fondazione's own PayPal account confirming a new one.
const PAYPAL_DONATE_URL = "https://www.paypal.com/donate/?hosted_button_id=YCRB5B4Q9FFEL";

// From Fondazione Dravet ETS's own letterhead (email 05/08/2026).
const FOUNDATION = {
  name: "Fondazione Dravet ETS",
  address: "Via Don Enrico Tazzoli 12, 37121 Verona",
  taxCode: "90018630237",
  email: "fondazionedravet@gmail.com",
};

/**
 * Donations page (DAND Scale plan, point 12: site structure). The PayPal
 * button is the Fondazione's own hosted button — donations go straight
 * to their account, this site never touches the money or stores payment
 * data.
 */
const Donate = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyTaxCode = async () => {
    try {
      await navigator.clipboard.writeText(FOUNDATION.taxCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Errore", description: "Impossibile copiare il codice fiscale.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(316,91%,40%,0.1)] flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-[hsl(316,91%,40%)]" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Sostieni Fondazione Dravet ETS</h1>
          <p className="text-muted-foreground">
            Il tuo contributo sostiene la ricerca, lo sviluppo di strumenti come la DAND Scale e il supporto alle famiglie.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dona con PayPal</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full bg-[hsl(316,91%,40%)] hover:bg-[hsl(316,91%,34%)] text-white">
              <a href={PAYPAL_DONATE_URL} target="_blank" rel="noreferrer">
                <Heart className="h-4 w-4 mr-2" />
                Dona ora
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5x1000</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Nella dichiarazione dei redditi, nella sezione "Sostegno del volontariato...", firma e inserisci il codice fiscale:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-3 py-2 rounded-lg text-lg font-mono font-semibold">
                {FOUNDATION.taxCode}
              </code>
              <Button variant="outline" size="icon" onClick={handleCopyTaxCode}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              {FOUNDATION.name} · {FOUNDATION.address}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donate;
