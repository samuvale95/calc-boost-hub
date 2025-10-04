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
  X,
  Filter,
  Search,
  Euro,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePayments } from "@/hooks/usePayments";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { PAYMENT_AMOUNTS, PAYMENT_DESCRIPTIONS } from "@/config/paypal";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { CreatePaymentRequest, Payment } from "@/services/paymentService";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const { 
    createPayment, 
    paymentSummary, 
    payments, 
    getMyPaymentSummary, 
    getMyPayments, 
    downloadPDF,
    isLoading: paymentsLoading 
  } = usePayments();
  const [isLoading, setIsLoading] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  
  // Payment history states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscriptionStatus();
      loadPaymentSummary();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (showPaymentHistory) {
      loadPayments();
    }
  }, [showPaymentHistory, currentPage, pageSize, statusFilter]);

  const loadPaymentSummary = async () => {
    try {
      await getMyPaymentSummary();
    } catch (error) {
      console.error('Error loading payment summary:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await getMyPayments(currentPage, pageSize, statusFilter || undefined);
      setTotalPages(response.pages);
      setTotalPayments(response.total);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const handleRefresh = () => {
    loadPayments();
    loadPaymentSummary();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === 'all' ? '' : status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Payment helper functions
  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'Completato';
      case 'pending':
        return 'In Attesa';
      case 'failed':
        return 'Fallito';
      case 'cancelled':
        return 'Cancellato';
      case 'refunded':
        return 'Rimborsato';
      default:
        return status;
    }
  };

  const getPaymentTypeIcon = (paymentType: string, subscriptionType?: string) => {
    if (paymentType === 'pdf' || subscriptionType === 'pdf') {
      return <Download className="h-4 w-4" />;
    }
    return <Calculator className="h-4 w-4" />;
  };

  const getPaymentTypeLabel = (payment: Payment) => {
    if (payment.payment_type === 'pdf') {
      return 'Guida PDF';
    }
    return payment.subscription_type === 'annuale' ? 'Abbonamento Annuale' : 'Abbonamento';
  };

  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.description.toLowerCase().includes(searchLower) ||
      payment.id.toString().includes(searchLower) ||
      (payment.paypal_order_id && payment.paypal_order_id.toLowerCase().includes(searchLower))
    );
  });

  const fetchSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Check if subscription is active based on expiry date
      const now = new Date();
      const expiryDate = user.subscription_expiry_date ? new Date(user.subscription_expiry_date) : null;
      const isSubscriptionActive = expiryDate ? expiryDate > now : false;
      
      // Calculate days remaining
      const daysRemaining = expiryDate ? Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
      
      const status = {
        isActive: user.is_active && isSubscriptionActive,
        subscriptionType: user.subscription,
        expiresAt: expiryDate,
        daysRemaining: daysRemaining,
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
      
      // Create payment record in backend
      const paymentRequest: CreatePaymentRequest = {
        amount: paymentData.amount,
        currency: 'EUR',
        subscription_type: paymentData.subscriptionType,
        subscription_duration_days: paymentData.subscriptionType === 'annuale' ? 365 : 0,
        description: paymentData.subscriptionType === 'annuale' 
          ? 'Abbonamento annuale Calc Boost Hub' 
          : 'Guida PDF Calc Boost Hub',
        is_renewal: paymentData.subscriptionType === 'annuale',
        auto_renewal_enabled: paymentData.subscriptionType === 'annuale',
        paypal_order_id: paymentData.orderId,
        paypal_payer_id: paymentData.paymentDetails?.payer?.payer_id || '',
      };

      await createPayment(paymentRequest);
      
      toast({
        title: "Rinnovo Completato!",
        description: "Il tuo abbonamento è stato rinnovato con successo.",
      });
      
      // Refresh subscription status and payment summary
      await fetchSubscriptionStatus();
      await loadPaymentSummary();
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
        title: 'PDF',
        description: 'Accesso alla guida PDF completa',
        icon: <Download className="h-5 w-5" />,
        status: 'PDF',
        statusColor: 'bg-blue-100 text-blue-800',
        price: PAYMENT_AMOUNTS.PDF,
        period: 'una tantum',
        isPdf: true
      };
    } else if (subscriptionType === 'annuale') {
      return {
        title: 'Abbonamento Annuale',
        description: 'Accesso completo al tool interattivo',
        icon: <Calculator className="h-5 w-5" />,
        status: isActive ? 'Attivo' : 'Scaduto',
        statusColor: isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
        price: PAYMENT_AMOUNTS.SUBSCRIPTION,
        period: 'all\'anno',
        isPdf: false
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
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold">Il Mio Profilo</h1>
            <p className="text-muted-foreground">
              Gestisci il tuo account e il tuo abbonamento
            </p>
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
                  
                  {/* Download PDF button for PDF subscriptions */}
                  {subscriptionInfo.isPdf && (
                    <div className="pt-4">
                      <Button 
                        onClick={() => downloadPDF()}
                        className="w-full"
                        variant="default"
                        disabled={paymentsLoading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {paymentsLoading ? 'Scaricamento...' : 'Scarica PDF'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Show days remaining only for annual subscriptions */}
                  {!subscriptionInfo.isPdf && subscriptionStatus?.daysRemaining > 0 && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>
                          {subscriptionStatus.daysRemaining} giorni rimanenti
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* PDF subscription - show upgrade option */}
                  {subscriptionInfo.isPdf && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900 mb-1">
                            Vuoi accedere al tool interattivo?
                          </h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Con l'abbonamento annuale potrai utilizzare il quiz interattivo e tutti gli strumenti avanzati.
                          </p>
                          <Button 
                            onClick={() => setShowRenewal(true)}
                            className="w-full"
                            variant="default"
                          >
                            Attiva Abbonamento Annuale
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Annual subscription - show renewal only if expired */}
                  {!subscriptionInfo.isPdf && !subscriptionStatus?.isActive && (
                    <div className="pt-4">
                      <Button 
                        onClick={() => setShowRenewal(true)}
                        className="w-full"
                        variant="default"
                      >
                        Rinnova Abbonamento
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

        {/* Payment History */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Cronologia Pagamenti
                </CardTitle>
                <CardDescription>
                  Visualizza e gestisci tutti i tuoi pagamenti
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentHistory(!showPaymentHistory)}
              >
                {showPaymentHistory ? 'Nascondi' : 'Mostra'} Dettagli
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {paymentSummary ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {paymentSummary.total_payments}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pagamenti Totali
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      €{paymentSummary.total_spent.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Totale Speso
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {paymentSummary.subscription_type || 'Nessuno'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Abbonamento Attuale
                    </div>
                  </div>
                </div>

                {/* Detailed Payment History */}
                {showPaymentHistory && (
                  <div className="space-y-4">
                    <Separator />
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Cerca per descrizione, ID o PayPal Order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="Filtra per stato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tutti gli stati</SelectItem>
                          <SelectItem value="completed">Completato</SelectItem>
                          <SelectItem value="pending">In Attesa</SelectItem>
                          <SelectItem value="failed">Fallito</SelectItem>
                          <SelectItem value="cancelled">Cancellato</SelectItem>
                          <SelectItem value="refunded">Rimborsato</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleRefresh} disabled={paymentsLoading} variant="outline">
                        <RefreshCw className={`h-4 w-4 mr-2 ${paymentsLoading ? 'animate-spin' : ''}`} />
                        Aggiorna
                      </Button>
                    </div>

                    {/* Payments List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Pagamenti ({totalPayments})</h4>
                      </div>
                      
                      {paymentsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Caricamento pagamenti...</span>
                        </div>
                      ) : filteredPayments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <CreditCard className="h-8 w-8 mx-auto mb-2" />
                          <p>Nessun pagamento trovato</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredPayments.map((payment) => (
                            <div
                              key={payment.id}
                              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getPaymentTypeIcon(payment.payment_type, payment.subscription_type)}
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">
                                        {getPaymentTypeLabel(payment)}
                                      </h3>
                                      <Badge className={getStatusColor(payment.status)}>
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(payment.status)}
                                          {getStatusLabel(payment.status)}
                                        </div>
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {payment.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                      <span>ID: {payment.id}</span>
                                      {payment.paypal_order_id && (
                                        <span>PayPal: {payment.paypal_order_id}</span>
                                      )}
                                      <span>
                                        {format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold">€{payment.amount.toFixed(2)}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {payment.currency}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Pagina {currentPage} di {totalPages} ({totalPayments} pagamenti totali)
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1 || paymentsLoading}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Precedente
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages || paymentsLoading}
                            >
                              Successiva
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2" />
                <p>Caricamento cronologia pagamenti...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Renewal Modal */}
      <Dialog open={showRenewal} onOpenChange={setShowRenewal}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {subscriptionInfo?.isPdf ? "Attiva Abbonamento Annuale" : "Rinnova Abbonamento"}
            </DialogTitle>
            <DialogDescription>
              {subscriptionInfo?.isPdf 
                ? "Completa il pagamento per attivare l'abbonamento annuale e accedere al tool interattivo"
                : "Completa il pagamento per rinnovare il tuo abbonamento"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            <PayPalCheckout
              subscriptionType={subscriptionInfo?.isPdf ? 'annuale' : (user?.subscription as 'pdf' | 'annuale')}
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
