import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { firebaseAuthService } from "@/services/firebaseAuthService";
import { CompleteProfileForm } from "@/components/CompleteProfileForm";

type Step = "completing" | "needs-email" | "error" | "done" | "verified-needs-login";

/**
 * Where a Firebase sign-in email link brings the user back to
 * (see SIGN_IN_REDIRECT_URL in src/config/firebase.ts). Also doubles as
 * the "complete your profile" step for a first-time sign-in, and as a
 * safe landing spot for an already-signed-in user with an incomplete
 * profile (see ProtectedRoute).
 */
const FinishSignIn = () => {
  const { t } = useTranslation();
  const { completeSignIn, refreshProfile, isAuthenticated, profileComplete, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("completing");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  // A Firebase email link (sign-in or verification) is single-use. This
  // effect re-runs whenever `loading`/`completeSignIn` change — and
  // completeSignIn itself flips `loading` — so without this guard the same
  // link would be consumed a second time, failing with "invalid action
  // code" right after a successful sign-in.
  const linkHandled = useRef(false);

  useEffect(() => {
    const url = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const oobCode = urlParams.get("oobCode");
    const emailFromUrl = urlParams.get("email");
    const email = emailFromUrl || firebaseAuthService.getPendingEmail();

    // 1. Passwordless Magic Sign-In Link
    if (firebaseAuthService.isSignInLink(url)) {
      if (linkHandled.current) return;
      linkHandled.current = true;
      if (email) {
        completeSignIn(email, url)
          .then(() => setStep("done"))
          .catch((err) => {
            console.error("Errore nel completamento dell'accesso:", err);
            const msg = err instanceof Error ? err.message : t('finishSignIn.linkExpiredError');
            setError(msg);
            setStep("error");
          });
      } else {
        // Fallback only if email is absent from both URL and localStorage
        setStep("needs-email");
      }
      return;
    }

    // 2. Email verification link from Firebase Auth (mode === 'verifyEmail')
    if (mode === "verifyEmail" && oobCode) {
      if (linkHandled.current) return;
      linkHandled.current = true;
      firebaseAuthService.verifyEmailWithCode(oobCode)
        .then(async () => {
          if (firebaseAuthService.currentUser) {
            await firebaseAuthService.getIdToken(true);
            try {
              await refreshProfile();
              setStep("done");
              return;
            } catch (syncErr) {
              console.warn("Could not sync profile immediately after verification:", syncErr);
            }
          }
          setStep("verified-needs-login");
        })
        .catch((err) => {
          console.error("Errore nella verifica dell'email:", err);
          const msg = err instanceof Error ? err.message : "Link di verifica non valido o scaduto.";
          setError(msg);
          setStep("error");
        });
      return;
    }

    // 3. User is already authenticated
    if (isAuthenticated) {
      setStep("done");
      return;
    }

    // 4. Still loading auth state
    if (loading) {
      setStep("completing");
      return;
    }

    setStep("error");
  }, [isAuthenticated, loading, completeSignIn, refreshProfile, t]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    try {
      setStep("completing");
      await completeSignIn(emailInput, window.location.href);
      setStep("done");
    } catch (err) {
      console.error("Errore nel completamento dell'accesso:", err);
      const msg = err instanceof Error ? err.message : t('finishSignIn.wrongEmailError');
      setError(msg);
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

  if (step === "verified-needs-login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Email verificata con successo!</h2>
            <p className="text-muted-foreground mb-4">
              Il tuo indirizzo email è stato confermato. Ora puoi accedere con le tue credenziali.
            </p>
            <Button asChild className="w-full">
              <a href="/login">Accedi al tuo account</a>
            </Button>
          </CardContent>
        </Card>
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
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {error ? "Errore di accesso" : t('finishSignIn.invalidLinkTitle')}
            </h2>
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
