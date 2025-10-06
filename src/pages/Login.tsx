import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { LoginSection } from "@/components/LoginSection";

const Login = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const { isAuthenticated } = useAuth();
  const { isUserAdmin } = useAdmin();
  const navigate = useNavigate();

  // No automatic redirect - let LoginSection handle it after successful login

  const handleClose = () => {
    setIsLoginOpen(false);
    // Redirect to home after closing
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Già Autenticato</h2>
              <p className="text-muted-foreground mb-4">
                Sei già loggato nel sistema
              </p>
              <Button asChild className="w-full">
                <a href="/profile">Vai al Profilo</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Torna alla Home
            </a>
          </Button>
        </div>
        
        <LoginSection
          isOpen={isLoginOpen}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default Login;