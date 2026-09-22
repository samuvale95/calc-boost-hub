import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { firebaseAuthService } from "@/services/firebaseAuthService";
import { CompleteProfileForm } from "@/components/CompleteProfileForm";

type Step = "completing" | "needs-email" | "error" | "done";

/**
 * Where a Firebase sign-in email link brings the user back to
 * (see SIGN_IN_REDIRECT_URL in src/config/firebase.ts). Also doubles as
 * the "complete your profile" step for a first-time sign-in, and as a
 * safe landing spot for an already-signed-in user with an incomplete
 * profile (see ProtectedRoute).
 */
const FinishSignIn = () => {
  const { t } = useTranslation();
  const { completeSignIn, isAuthenticated, profileComplete, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("completing");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = window.location.href;

    if (!firebaseAuthService.isSignInLink(url)) {
      // Not arriving from a link — either already signed in with an
      // incomplete profile (ProtectedRoute sent us here), or a direct
      // visit with nothing to do.
      setStep(isAuthenticated ? "done" : "error");
      return;
    }

    const email = firebaseAuthService.getPendingEmail();
    if (email) {
      completeSignIn(email, url)
        .then(() => setStep("done"))
        .catch((err) => {
          console.error("Errore nel completamento dell'accesso:", err);
          setError(t('finishSignIn.linkExpiredError'));
          setStep("error");
        });
    } else {
      // Opened on a different device/browser than the one that requested
      // the link — Firebase needs the email typed again to verify it matches.
      setStep("needs-email");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    try {
      setStep("completing");
      await completeSignIn(emailInput, window.location.href);
      setStep("done");
    } catch (err) {
      console.error("Errore nel completamento dell'accesso:", err);
      setError(t('finishSignIn.wrongEmailError'));
      setStep("error");
    }
  };

  if (step === "done" && !loading) {
    if (profileComplete) {
      navigate("/quiz", { replace: true });
      return null;
    }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <CompleteProfileForm onComplete={() => navigate("/quiz", { replace: true })} />
      </div>
    );
  }

  if (step === "needs-email") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              {t('finishSignIn.confirmEmailTitle')}
            </CardTitle>
            <CardDescription>
              {t('finishSignIn.confirmEmailDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t('finishSignIn.confirm')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('finishSignIn.invalidLinkTitle')}</h2>
            <p className="text-muted-foreground mb-4">
              {error || t('finishSignIn.invalidLinkDescription')}
            </p>
            <Button asChild className="w-full">
              <a href="/login">{t('finishSignIn.backToLogin')}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('finishSignIn.completing')}</p>
      </div>
    </div>
  );
};

export default FinishSignIn;
