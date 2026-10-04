import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
import { Lock, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { firebaseAuthService } from "@/services/firebaseAuthService";

type Step = "verifying" | "form" | "done" | "invalid";

/**
 * Where the Firebase password-reset email brings the user back to (set as
 * the "Password reset" template's action URL in the Firebase console).
 * Same look as the login page: a dialog over the app background.
 */
const ResetPassword = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("verifying");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const oobCode = new URLSearchParams(window.location.search).get("oobCode");
  const checked = useRef(false);

  useEffect(() => {
    // The code is checked once; React StrictMode would otherwise run this twice.
    if (checked.current) return;
    checked.current = true;

    if (!oobCode) {
      setStep("invalid");
      return;
    }
    firebaseAuthService
      .verifyPasswordResetCode(oobCode)
      .then((resolvedEmail) => {
        setEmail(resolvedEmail);
        setStep("form");
      })
      .catch(() => setStep("invalid"));
  }, [oobCode]);

  const goHome = () => navigate("/");
  const goToLogin = () => navigate("/login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (password.length < 8) {
      setErrorMessage(t("login.errorWeakPassword"));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t("resetPassword.errorMismatch"));
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await firebaseAuthService.confirmPasswordReset(oobCode, password);
      setStep("done");
    } catch (error) {
      console.error("Errore nel reset della password:", error);
      const code = (error as { code?: string })?.code;
      if (code === "auth/expired-action-code" || code === "auth/invalid-action-code") {
        setStep("invalid");
        return;
      }
      const msg = code === "auth/weak-password" ? t("login.errorWeakPassword") : t("resetPassword.errorGeneric");
      setErrorMessage(msg);
      toast({ title: t("login.errorTitle"), description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("login.backHome")}
            </a>
          </Button>
        </div>

        {step === "verifying" && (
          <Dialog open onOpenChange={goHome}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <KeyRound className="h-6 w-6" />
                  {t("resetPassword.title")}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 pt-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("resetPassword.verifying")}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        {step === "invalid" && (
          <Dialog open onOpenChange={goHome}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-6 w-6" />
                  {t("resetPassword.invalidTitle")}
                </DialogTitle>
                <DialogDescription>{t("resetPassword.invalidDescription")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={goToLogin} className="w-full">
                  {t("finishSignIn.backToLogin")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {step === "done" && (
          <Dialog open onOpenChange={goToLogin}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  {t("resetPassword.doneTitle")}
                </DialogTitle>
                <DialogDescription>{t("resetPassword.doneDescription")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={goToLogin} className="w-full">
                  {t("resetPassword.goToLogin")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {step === "form" && (
          <Dialog open onOpenChange={goHome}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <KeyRound className="h-6 w-6" />
                  {t("resetPassword.title")}
                </DialogTitle>
                <DialogDescription>{t("resetPassword.description", { email })}</DialogDescription>
              </DialogHeader>

              {errorMessage && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("resetPassword.newPasswordLabel")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.passwordPlaceholder")}
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      minLength={8}
                      autoComplete="new-password"
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
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("resetPassword.confirmPasswordLabel")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.passwordPlaceholder")}
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      minLength={8}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("login.sending")}
                    </>
                  ) : (
                    t("resetPassword.submit")
                  )}
                </Button>
              </form>

              <DialogFooter className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={goHome}
                  disabled={isLoading}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("common.back")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
