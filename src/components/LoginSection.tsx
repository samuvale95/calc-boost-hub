import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Mail, 
  Lock, 
  Loader2, 
  CheckCircle, 
  ArrowLeft,
  Eye,
  EyeOff,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginSection = ({ isOpen, onClose }: LoginSectionProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const { isUserAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Errore",
        description: "Inserisci email e password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setIsSuccess(true);
        
        toast({
          title: "Accesso Riuscito!",
          description: "Benvenuto nel sistema",
        });

        // Redirect after a short delay to show success message
        setTimeout(() => {
          const from = location.state?.from?.pathname || (isUserAdmin() ? "/admin" : "/quiz");
          navigate(from, { replace: true });
          handleClose();
        }, 1500);

      } else {
        toast({
          title: "Errore di Accesso",
          description: "Email o password non corretti",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: "Errore di Connessione",
        description: "Impossibile connettersi al server. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    setIsSuccess(false);
    setShowPassword(false);
    onClose();
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Accesso Riuscito!
            </DialogTitle>
            <DialogDescription>
              Il tuo accesso è stato completato con successo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Benvenuto!</h3>
              <p className="text-muted-foreground">
                Stai per essere reindirizzato alla tua dashboard
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">
                Puoi ora accedere a tutti i servizi disponibili per il tuo account.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Accedi al Tuo Account
          </DialogTitle>
          <DialogDescription>
            Inserisci le tue credenziali per accedere al sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-4">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLoading}
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

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Non hai un account?</strong> Vai alla <a href="/#pricing" className="text-primary hover:underline">sezione prezzi</a> per scegliere un piano e registrarti.
              </p>
            </div>
          </form>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Accesso in corso...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Accedi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};