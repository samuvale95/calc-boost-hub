import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { IndustryNoticeModal } from "@/components/IndustryNotice";

interface LoginSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Maps common Firebase Auth error codes to a translation key. */
const mapAuthError = (error: unknown): string => {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "login.errorEmailInUse";
    case "auth/weak-password":
      return "login.errorWeakPassword";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "login.errorInvalidCredentials";
    default:
      return "login.errorSendFailed";
  }
};

/**
 * Sign-in. Two independent paths, both covered by the same backend
 * auto-provisioning (see get_current_user):
 * - "Link" (default): passwordless email link (DAND Scale plan, point 5:
 *   "evitare password condivisa"). Same flow for a first-time
 *   registration and a returning sign-in.
 * - "Password": fallback for mail setups that strip/delay magic links.
 *   Sign-in and registration are deliberately separate actions here (not
 *   "try sign-in, fall back to register") — recent Firebase projects
 *   collapse auth/user-not-found and auth/wrong-password into the same
 *   auth/invalid-credential for email-enumeration protection, so that
 *   distinction can't be made reliably from the error code. See
 *   firebaseAuthService.ts.
 */
export const LoginSection = ({ isOpen, onClose }: LoginSectionProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendSignInLink, signInWithPassword, registerWithPassword, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMode, setPasswordMode] = useState<"signin" | "register">("signin");

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({ title: t('login.errorTitle'), description: t('login.errorEmailRequired'), variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      setAuthErrorMessage(null);
      await sendSignInLink(email);
      setLinkSent(true);
    } catch (error) {
      console.error("Errore nell'invio del link:", error);
      const msg = error instanceof Error ? error.message : t('login.errorSendFailed');
      setAuthErrorMessage(msg);
      toast({ title: t('login.errorTitle'), description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({ title: t('login.errorTitle'), description: t('login.errorEmailRequired'), variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      setAuthErrorMessage(null);
      if (passwordMode === "signin") {
        await signInWithPassword(email, password);
        setEmail("");
        setPassword("");
        setPasswordMode("signin");
        navigate("/finish-signin", { replace: true });
      } else {
        await registerWithPassword(email, password);
        setVerificationSent(true);
      }
    } catch (error) {
      console.error("Errore di autenticazione:", error);
      let msg = t('login.errorSendFailed');
      const code = (error as { code?: string })?.code;
      if (code) {
        msg = t(mapAuthError(error));
      } else if (error instanceof Error && error.message) {
        msg = error.message;
      }
      setAuthErrorMessage(msg);
      toast({ title: t('login.errorTitle'), description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: t('login.errorTitle'), description: t('login.errorEmailRequired'), variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      setAuthErrorMessage(null);
      await resetPassword(email, i18n.language);
      setResetSent(true);
    } catch (error) {
      // The backend answers the same for known and unknown emails, so only
      // a rate limit or a real failure ends up here.
      const status = (error as { status?: number })?.status;
      const msg = status === 429 ? t('login.errorResetTooMany') : t('login.errorResetFailed');
      setAuthErrorMessage(msg);
      toast({ title: t('login.errorTitle'), description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setLinkSent(false);
    setVerificationSent(false);
    setResetSent(false);
    setAuthErrorMessage(null);
    setPasswordMode("signin");
    onClose();
  };

  if (verificationSent) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Account creato con successo!
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-foreground space-y-2">
              <p>
                Abbiamo inviato un'email di conferma a <strong>{email}</strong>.
              </p>
              <p>
                <strong>Basta cliccare sul link ricevuto via email</strong> per confermare il tuo account ed effettuare l'accesso.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
            Non trovi l'email? Controlla anche nella cartella <strong>Spam</strong> o Posta indesiderata.
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (resetSent) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              {t('login.resetSentTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('login.resetSentDescription', { email })}
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
    <>
    <IndustryNoticeModal active={isOpen} />
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

        {authErrorMessage && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1 space-y-1">
              <p>{authErrorMessage}</p>
              {authErrorMessage.toLowerCase().includes("verificata") && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      toast({ title: t('login.errorTitle'), description: t('login.errorEmailRequired'), variant: "destructive" });
                      return;
                    }
                    try {
                      setIsLoading(true);
                      await sendSignInLink(email);
                      setLinkSent(true);
                      setAuthErrorMessage(null);
                    } catch {
                      toast({ title: t('login.errorTitle'), description: "Impossibile inviare il link.", variant: "destructive" });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="text-xs underline font-semibold block hover:opacity-80 cursor-pointer"
                >
                  Clicca qui per inviare un link di conferma alla tua email
                </button>
              )}
            </div>
          </div>
        )}

        <Tabs defaultValue="link" className="py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">{t('login.linkTab')}</TabsTrigger>
            <TabsTrigger value="password">{t('login.passwordTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 pt-2">
            <form onSubmit={handleSendLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-email">{t('login.emailLabel')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="link-email"
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
                <p className="text-xs text-muted-foreground">{t('login.note')}</p>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('login.sending')}
                  </>
                ) : (
                  t('login.submit')
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password" className="space-y-4 pt-2">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-email">{t('login.emailLabel')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password-email"
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

              <div className="space-y-2">
                <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('login.passwordPlaceholder')}
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    minLength={passwordMode === "register" ? 8 : undefined}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setPasswordMode(passwordMode === "signin" ? "register" : "signin")}
                disabled={isLoading}
              >
                {passwordMode === "signin" ? t('login.switchToRegister') : t('login.switchToSignIn')}
              </button>

              {passwordMode === "signin" && (
                <button
                  type="button"
                  className="block text-xs text-primary hover:underline"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  {t('login.forgotPassword')}
                </button>
              )}

              <Button type="submit" disabled={isLoading} className="w-full flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('login.sending')}
                  </>
                ) : passwordMode === "signin" ? (
                  t('login.signInSubmit')
                ) : (
                  t('login.registerSubmit')
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
