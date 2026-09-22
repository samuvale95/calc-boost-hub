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
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendSignInLink, signInWithPassword, registerWithPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

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
      await sendSignInLink(email);
      setLinkSent(true);
    } catch (error) {
      console.error("Errore nell'invio del link:", error);
      toast({ title: t('login.errorTitle'), description: t('login.errorSendFailed'), variant: "destructive" });
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
      if (passwordMode === "signin") {
        await signInWithPassword(email, password);
      } else {
        await registerWithPassword(email, password);
      }
      // Reset local state directly rather than calling handleClose()
      // (which also fires the parent's onClose — Login.tsx's onClose
      // redirects to "/" on a delay, which would clobber this navigate).
      setEmail("");
      setPassword("");
      setPasswordMode("signin");
      navigate("/finish-signin", { replace: true });
    } catch (error) {
      console.error("Errore di autenticazione:", error);
      toast({ title: t('login.errorTitle'), description: t(mapAuthError(error)), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setLinkSent(false);
    setPasswordMode("signin");
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
  );
};
