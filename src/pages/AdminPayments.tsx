import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Calendar, 
  Euro, 
  Filter, 
  Search, 
  RefreshCw, 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit
} from 'lucide-react';
import { useAdminPayments } from '@/hooks/usePayments';
import { useAdmin } from '@/hooks/useAdmin';
import { Payment, PaymentStats } from '@/services/paymentService';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const AdminPayments = () => {
  const { isUserAdmin } = useAdmin();
  const { 
    allPayments, 
    paymentStats, 
    isLoading, 
    getAllPayments, 
    getPaymentStats,
    updatePaymentStatus
  } = useAdminPayments();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Payment['status']>('pending');

  useEffect(() => {
    if (isUserAdmin()) {
      loadPayments();
      loadStats();
    }
  }, [isUserAdmin, currentPage, pageSize, statusFilter, userIdFilter]);

  const loadPayments = async () => {
    try {
      const response = await getAllPayments(
        currentPage, 
        pageSize, 
        statusFilter || undefined,
        userIdFilter ? Number(userIdFilter) : undefined
      );
      setTotalPages(response.pages);
      setTotalPayments(response.total);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const loadStats = async () => {
    try {
      await getPaymentStats();
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRefresh = () => {
    loadPayments();
    loadStats();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === 'all' ? '' : status);
    setCurrentPage(1);
  };

  const handleUserIdFilter = (userId: string) => {
    setUserIdFilter(userId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateStatus = async () => {
    if (!selectedPayment) return;
    
    try {
      await updatePaymentStatus(selectedPayment.id, newStatus);
      setIsUpdateDialogOpen(false);
      setSelectedPayment(null);
      loadPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const openUpdateDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setIsUpdateDialogOpen(true);
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
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
      return <CreditCard className="h-4 w-4" />;
    }
    return <Users className="h-4 w-4" />;
  };

  const getPaymentTypeLabel = (payment: Payment) => {
    if (payment.payment_type === 'pdf') {
      return 'Kit D-DAND PDF';
    }
    return payment.subscription_type === 'annuale' ? 'Abbonamento Annuale' : 'Abbonamento';
  };

  const filteredPayments = allPayments.filter(payment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.description.toLowerCase().includes(searchLower) ||
      payment.id.toString().includes(searchLower) ||
      payment.user_id.toString().includes(searchLower) ||
      (payment.paypal_order_id && payment.paypal_order_id.toLowerCase().includes(searchLower)) ||
      (payment.paypal_transaction_id && payment.paypal_transaction_id.toLowerCase().includes(searchLower))
    );
  });

  if (!isUserAdmin()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Accesso Negato</h2>
              <p className="text-muted-foreground mb-4">
                Solo gli amministratori possono accedere a questa sezione
              </p>
              <Button asChild className="w-full">
                <a href="/">Torna alla Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestione Pagamenti</h1>
              <p className="text-muted-foreground">
                Amministra tutti i pagamenti del sistema
              </p>
            </div>
            <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {paymentStats && (
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Totale Pagamenti</p>
                    <p className="text-2xl font-bold">{paymentStats.total_payments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Ricavi Totali</p>
                    <p className="text-2xl font-bold">€{paymentStats.total_revenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Completati</p>
                    <p className="text-2xl font-bold text-green-600">{paymentStats.completed_payments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Media Pagamento</p>
                    <p className="text-2xl font-bold">€{paymentStats.average_payment.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cerca per descrizione, ID, PayPal ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                <SelectTrigger>
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
              <div className="flex gap-2">
                <Input
                  placeholder="User ID"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                  type="number"
                />
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Pagamenti ({totalPayments})</CardTitle>
            <CardDescription>
              Lista di tutti i pagamenti del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
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
              <div className="space-y-4">
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
                            <span>User ID: {payment.user_id}</span>
                            {payment.paypal_order_id && (
                              <span>PayPal: {payment.paypal_order_id}</span>
                            )}
                            <span>
                              {format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-lg font-bold">€{payment.amount.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.currency}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUpdateDialog(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Pagina {currentPage} di {totalPages} ({totalPayments} pagamenti totali)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Precedente
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Successiva
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiorna Stato Pagamento</DialogTitle>
              <DialogDescription>
                Modifica lo stato del pagamento #{selectedPayment?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Nuovo Stato</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Payment['status'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">In Attesa</SelectItem>
                    <SelectItem value="completed">Completato</SelectItem>
                    <SelectItem value="failed">Fallito</SelectItem>
                    <SelectItem value="cancelled">Cancellato</SelectItem>
                    <SelectItem value="refunded">Rimborsato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleUpdateStatus} disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Aggiorna
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPayments;

