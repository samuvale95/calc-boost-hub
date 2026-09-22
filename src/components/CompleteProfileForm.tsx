import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
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
        title: t('completeProfile.errorTitle'),
        description: t('completeProfile.errorRequiredFields'),
        variant: "destructive",
      });
      return;
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      toast({
        title: t('completeProfile.errorTitle'),
        description: t('completeProfile.errorConsent'),
        variant: "destructive",
      });
      return;
    }

    const payload: ProfileData = {
      center: formData.center,
      professional_role: formData.professionalRole,
      phone: formData.phone,
      country: formData.country || undefined,
      preferred_language: i18n.language,
      accepted_terms: acceptedTerms,
      accepted_privacy: acceptedPrivacy,
    };

    try {
      setIsLoading(true);
      await completeProfile(payload);
      toast({
        title: t('completeProfile.successTitle'),
        description: t('completeProfile.successDescription'),
      });
      onComplete();
    } catch (error) {
      console.error("Errore nel completamento del profilo:", error);
      toast({
        title: t('completeProfile.errorTitle'),
        description: error instanceof Error ? error.message : t('completeProfile.errorGeneric'),
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
          {t('completeProfile.title')}
        </CardTitle>
        <CardDescription>
          {(user?.name || firebaseUser?.email) && (
            <>{t('completeProfile.descriptionConfirmed', { email: user?.email || firebaseUser?.email })} </>
          )}
          {t('completeProfile.descriptionBody')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="center">{t('completeProfile.centerLabel')}</Label>
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
            <Label htmlFor="professionalRole">{t('completeProfile.professionalRoleLabel')}</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="professionalRole"
                className="pl-10"
                placeholder={t('completeProfile.professionalRolePlaceholder')}
                value={formData.professionalRole}
                onChange={(e) => handleChange("professionalRole", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('completeProfile.phoneLabel')}</Label>
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
            <Label htmlFor="country">{t('completeProfile.countryLabel')}</Label>
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
                {t('completeProfile.termsLabel', {
                  link: t('completeProfile.termsLink'),
                  interpolation: { escapeValue: false },
                }).split(t('completeProfile.termsLink')).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <a href="/conditions-of-use" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                        {t('completeProfile.termsLink')}
                      </a>
                    )}
                  </span>
                ))}
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
                {t('completeProfile.privacyLabel', {
                  link: t('completeProfile.privacyLink'),
                  interpolation: { escapeValue: false },
                }).split(t('completeProfile.privacyLink')).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <a href="/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                        {t('completeProfile.privacyLink')}
                      </a>
                    )}
                  </span>
                ))}
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('completeProfile.submitting')}
              </>
            ) : (
              t('completeProfile.submit')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
