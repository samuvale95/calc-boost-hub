import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Download,
  Calculator,
  Loader2,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { PAYMENT_AMOUNTS, PAYMENT_DESCRIPTIONS } from "@/config/paypal";
import { buildApiUrl, API_CONFIG } from "@/config/api";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscriptionStatus();
    }
  }, [isAuthenticated, user]);

  const fetchSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // In a real app, you would fetch this from your API
      // For now, we'll simulate the subscription status based on user data
      const status = {
        isActive: user.is_active,
        subscriptionType: user.subscription,
        expiresAt: user.last_access ? new Date(user.last_access) : null,
        daysRemaining: user.is_active ? 30 : 0, // Simulated
        canRenew: !user.is_active || (user.subscription === 'pdf' && user.is_active),
      };
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare lo stato dell'abbonamento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewalSuccess = async (paymentData: any) => {
    try {
      setIsLoading(true);
      
      // In a real app, you would send the payment data to your backend
      // to update the subscription status
      console.log('Renewal payment successful:', paymentData);
      
      toast({
        title: "Rinnovo Completato!",
        description: "Il tuo abbonamento è stato rinnovato con successo.",
      });
      
      // Refresh subscription status
      await fetchSubscriptionStatus();
      setShowRenewal(false);
      
    } catch (error) {
      console.error('Error processing renewal:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'elaborazione del rinnovo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewalError = (error: any) => {
    console.error('Renewal error:', error);
    toast({
      title: "Errore nel Pagamento",
      description: "Si è verificato un errore durante il rinnovo",
      variant: "destructive",
    });
  };

  const getSubscriptionInfo = () => {
    if (!subscriptionStatus) return null;
    
    const { subscriptionType, isActive, daysRemaining } = subscriptionStatus;
    
    if (subscriptionType === 'pdf') {
      return {
        title: 'Guida PDF',
        description: 'Accesso alla guida PDF completa',
        icon: <Download className="h-5 w-5" />,
        status: isActive ? 'Attivo' : 'Scaduto',
        statusColor: isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
        canRenew: true,
        price: PAYMENT_AMOUNTS.PDF,
        period: 'una tantum'
      };
    } else if (subscriptionType === 'annuale') {
      return {
        title: 'Abbonamento Annuale',
        description: 'Accesso completo al tool interattivo',
        icon: <Calculator className="h-5 w-5" />,
        status: isActive ? 'Attivo' : 'Scaduto',
        statusColor: isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
        canRenew: true,
        price: PAYMENT_AMOUNTS.SUBSCRIPTION,
        period: 'all\'anno'
      };
    }
    
    return null;
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Accesso Richiesto</h2>
              <p className="text-muted-foreground mb-4">
                Devi effettuare l'accesso per visualizzare il tuo profilo e gestire il tuo abbonamento
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <a href="/login">Accedi al tuo Account</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/#pricing">Scegli un Piano</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionInfo();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Il Mio Profilo</h1>
              <p className="text-muted-foreground">
                Gestisci il tuo account e il tuo abbonamento
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              Esci
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informazioni Personali
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Membro dal</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.registration_date).toLocaleDateString('it-IT')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Stato Abbonamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Caricamento...</span>
                </div>
              ) : subscriptionInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {subscriptionInfo.icon}
                      <span className="font-medium">{subscriptionInfo.title}</span>
                    </div>
                    <Badge className={subscriptionInfo.statusColor}>
                      {subscriptionInfo.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {subscriptionInfo.description}
                  </p>
                  
                  {subscriptionStatus?.daysRemaining > 0 && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>
                          {subscriptionStatus.daysRemaining} giorni rimanenti
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {subscriptionInfo.canRenew && (
                    <div className="pt-4">
                      <Button 
                        onClick={() => setShowRenewal(true)}
                        className="w-full"
                        variant={subscriptionStatus?.isActive ? "outline" : "default"}
                      >
                        {subscriptionStatus?.isActive ? "Rinnova Abbonamento" : "Attiva Abbonamento"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nessun abbonamento attivo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History (placeholder) */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Cronologia Pagamenti
            </CardTitle>
            <CardDescription>
              Visualizza la cronologia dei tuoi pagamenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
              <p>La cronologia dei pagamenti sarà disponibile a breve</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Modal */}
      <Dialog open={showRenewal} onOpenChange={setShowRenewal}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Rinnova Abbonamento
            </DialogTitle>
            <DialogDescription>
              Completa il pagamento per rinnovare il tuo abbonamento
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            <PayPalCheckout
              subscriptionType={user?.subscription as 'pdf' | 'annuale'}
              userData={{
                name: user?.name || '',
                email: user?.email || '',
              }}
              onPaymentSuccess={handleRenewalSuccess}
              onPaymentError={handleRenewalError}
              onCancel={() => setShowRenewal(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
