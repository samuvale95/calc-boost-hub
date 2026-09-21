import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Briefcase, Phone, Globe, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileData } from "@/services/authService";

interface CompleteProfileFormProps {
  onComplete: () => void;
}

/**
 * The registration form (DAND Scale plan, point 4): asked once, right
 * after a person signs in with Firebase for the first time. Identity
 * (name/email) already comes from Firebase — this only collects the
 * fields the Fondazione needs to track who uses the scale.
 */
export const CompleteProfileForm = ({ onComplete }: CompleteProfileFormProps) => {
  const { completeProfile, user, firebaseUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    center: "",
    professionalRole: "",
    phone: "",
    country: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.center || !formData.professionalRole || !formData.phone) {
      toast({
        title: "Errore",
        description: "Centro, ruolo e telefono sono obbligatori",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      toast({
        title: "Errore",
        description: "Devi accettare le Conditions of Use e prendere visione della Privacy Policy",
        variant: "destructive",
      });
      return;
    }

    const payload: ProfileData = {
      center: formData.center,
      professional_role: formData.professionalRole,
      phone: formData.phone,
      country: formData.country || undefined,
      accepted_terms: acceptedTerms,
      accepted_privacy: acceptedPrivacy,
    };

    try {
      setIsLoading(true);
      await completeProfile(payload);
      toast({
        title: "Registrazione completata!",
        description: "Il tuo profilo è stato salvato con successo.",
      });
      onComplete();
    } catch (error) {
      console.error("Errore nel completamento del profilo:", error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Impossibile completare la registrazione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          Completa la registrazione
        </CardTitle>
        <CardDescription>
          {(user?.name || firebaseUser?.email) && (
            <>Accesso confermato per <strong>{user?.email || firebaseUser?.email}</strong>. </>
          )}
          Alcune informazioni per usare la DAND Scale.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="center">Centro di appartenenza</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="center"
                className="pl-10"
                value={formData.center}
                onChange={(e) => handleChange("center", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="professionalRole">Ruolo nel centro</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="professionalRole"
                className="pl-10"
                placeholder="es. Neuropsichiatra Infantile"
                value={formData.professionalRole}
                onChange={(e) => handleChange("professionalRole", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numero telefonico</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Paese (opzionale)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="country"
                className="pl-10"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                Accetto le <a href="/conditions-of-use" className="text-primary hover:underline" target="_blank" rel="noreferrer">Conditions of Use</a> della DAND Scale
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="privacy" className="text-sm font-normal leading-snug">
                Ho preso visione della <a href="/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noreferrer">Privacy Policy</a>
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Invio in corso...
              </>
            ) : (
              "Completa la registrazione"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
