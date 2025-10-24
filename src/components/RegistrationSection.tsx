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
  User, 
  Mail, 
  Lock, 
  Loader2, 
  CheckCircle, 
  ArrowLeft,
  FileText,
  Calculator,
  Eye,
  EyeOff,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { PayPalCheckout } from "./PayPalCheckout";
import { PAYMENT_AMOUNTS } from "@/config/paypal";

interface RegistrationSectionProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionType: 'pdf' | 'annuale' | null;
}

export const RegistrationSection = ({ isOpen, onClose, subscriptionType }: RegistrationSectionProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Errore",
        description: "Tutti i campi sono obbligatori",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non coincidono",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Errore",
        description: "La password deve essere di almeno 6 caratteri",
        variant: "destructive",
      });
      return;
    }

    if (!subscriptionType) {
      toast({
        title: "Errore",
        description: "Tipo di abbonamento non selezionato",
        variant: "destructive",
      });
      return;
    }

    // Proceed to payment step
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      setIsLoading(true);
      
      // Register user with payment confirmation
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          subscription: subscriptionType,
          paymentId: paymentData.orderId,
          paymentStatus: paymentData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Errore HTTP: ${response.status}`);
      }

      const newUser = await response.json();
      setPaymentData(paymentData);
      setIsSuccess(true);
      
      toast({
        title: "Registrazione e Pagamento Completati!",
        description: `Benvenuto ${newUser.name}! Il tuo account è stato creato e il pagamento è stato elaborato con successo.`,
      });

    } catch (err) {
      console.error('Errore nella registrazione:', err);
      
      toast({
        title: "Errore di Registrazione",
        description: err instanceof Error ? err.message : "Impossibile completare la registrazione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setIsSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowPayment(false);
    setPaymentData(null);
    onClose();
  };

  const getSubscriptionInfo = () => {
    switch (subscriptionType) {
      case 'pdf':
        return {
          title: 'Acquisto Kit D-DAND PDF',
          description: 'Registrazione per il download della Kit D-DAND PDF',
          icon: <FileText className="h-6 w-6" />,
          price: `€${PAYMENT_AMOUNTS.PDF}`,
          period: 'una tantum'
        };
      case 'annuale':
        return {
          title: 'Abbonamento Annuale',
          description: 'Registrazione per l\'accesso al test interattivo',
          icon: <Calculator className="h-6 w-6" />,
          price: `€${PAYMENT_AMOUNTS.SUBSCRIPTION}`,
          period: 'all\'anno'
        };
      default:
        return {
          title: 'Registrazione',
          description: 'Completa la registrazione',
          icon: <User className="h-6 w-6" />,
          price: '',
          period: ''
        };
    }
  };

  const subscriptionInfo = getSubscriptionInfo();

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Registrazione e Pagamento Completati!
            </DialogTitle>
            <DialogDescription>
              La tua registrazione e il pagamento sono stati completati con successo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Benvenuto {formData.name}!</h3>
              <p className="text-muted-foreground">
                Il tuo account è stato creato con successo per <strong>{formData.email}</strong>
              </p>
            </div>
            {paymentData && (
              <div className="bg-muted p-4 rounded-lg mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Pagamento Confermato</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  ID Pagamento: {paymentData.orderId}
                </p>
                <p className="text-xs text-muted-foreground">
                  Importo: €{paymentData.amount}
                </p>
              </div>
            )}
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">
                Puoi ora accedere al sistema utilizzando le credenziali che hai inserito.
                {subscriptionType === 'pdf' ? ' Il Kit D-DAND PDF sarà disponibile per il download.' : ' Il tuo abbonamento annuale è attivo.'}
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

  if (showPayment) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Completamento Pagamento
            </DialogTitle>
            <DialogDescription>
              Completa il pagamento per finalizzare la tua registrazione
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <PayPalCheckout
              subscriptionType={subscriptionType!}
              userData={{
                name: formData.name,
                email: formData.email,
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handlePaymentCancel}
              disabled={isLoading}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Registrazione
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
            {subscriptionInfo.icon}
            {subscriptionInfo.title}
          </DialogTitle>
          <DialogDescription>
            {subscriptionInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-4">
          {/* Subscription Info Card */}
          <Card className="mb-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {subscriptionInfo.icon}
                  <span className="font-medium text-sm">
                    {subscriptionType === 'annuale' ? 'Test Interattivo' : 'Kit D-DAND PDF'}
                  </span>
                </div>
                <Badge variant={subscriptionType === 'annuale' ? 'default' : 'outline'} className="text-xs">
                  {subscriptionType === 'annuale' ? 'Più Popolare' : 'Download'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{subscriptionInfo.price}</span>
                <span className="text-muted-foreground text-sm">{subscriptionInfo.period}</span>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Il tuo nome completo"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            
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
                  placeholder="Scegli una password sicura"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ripeti la password"
                  className="pl-10 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Requisiti password:</strong> Almeno 6 caratteri. Scegli una password sicura che non hai mai usato prima.
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
                Elaborazione...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Procedi al Pagamento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
