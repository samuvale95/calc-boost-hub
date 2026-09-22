import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LoginSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Passwordless sign-in (DAND Scale plan, point 5): the same flow serves
 * both a first-time registration and a returning sign-in — a link is sent
 * either way, and the backend creates the local profile row on first use
 * (see get_current_user). What's asked afterward (see
 * CompleteProfileForm) only happens once, for a genuinely new profile.
 */
export const LoginSection = ({ isOpen, onClose }: LoginSectionProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { toast } = useToast();
  const { sendSignInLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: t('login.errorTitle'),
        description: t('login.errorEmailRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await sendSignInLink(email);
      setLinkSent(true);
    } catch (error) {
      console.error("Errore nell'invio del link:", error);
      toast({
        title: t('login.errorTitle'),
        description: t('login.errorSendFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setLinkSent(false);
    onClose();
  };

  if (linkSent) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              {t('login.linkSentTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('login.linkSentDescription', { email })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            {t('login.title')}
          </DialogTitle>
          <DialogDescription>
            {t('login.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email">{t('login.emailLabel')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t('login.emailPlaceholder')}
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              {t('login.note')}
            </p>
          </div>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('login.sending')}
              </>
            ) : (
              t('login.submit')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
