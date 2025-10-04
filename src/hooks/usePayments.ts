import { useState, useCallback, useMemo } from 'react';
import { paymentService, Payment, PaymentSummary, PaymentHistoryResponse, PaymentStats, CreatePaymentRequest } from '@/services/paymentService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook per gestire i pagamenti dell'utente
 */
export const usePayments = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);

  // Wrapper per assicurarsi che l'utente sia autenticato
  const authenticatedRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to make this request');
    }
    return requestFn();
  }, [isAuthenticated]);

  /**
   * Crea un nuovo pagamento
   */
  const createPayment = useCallback(async (paymentData: CreatePaymentRequest): Promise<Payment> => {
    try {
      setIsLoading(true);
      const payment = await authenticatedRequest(() => paymentService.createPayment(paymentData));
      
      toast({
        title: "Pagamento Creato",
        description: "Il pagamento è stato creato con successo",
      });
      
      return payment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante la creazione del pagamento';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest, toast]);

  /**
   * Ottiene la cronologia pagamenti dell'utente
   */
  const getMyPayments = useCallback(async (
    page: number = 1,
    size: number = 10,
    paymentStatus?: string
  ): Promise<PaymentHistoryResponse> => {
    try {
      setIsLoading(true);
      const response = await authenticatedRequest(() => 
        paymentService.getMyPayments(page, size, paymentStatus)
      );
      
      setPayments(response.payments);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento dei pagamenti';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest, toast]);

  /**
   * Ottiene il riepilogo pagamenti dell'utente
   */
  const getMyPaymentSummary = useCallback(async (): Promise<PaymentSummary> => {
    try {
      setIsLoading(true);
      const summary = await authenticatedRequest(() => paymentService.getMyPaymentSummary());
      setPaymentSummary(summary);
      return summary;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento del riepilogo';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest, toast]);

  /**
   * Ottiene i dettagli di un pagamento specifico
   */
  const getPaymentById = useCallback(async (paymentId: number): Promise<Payment> => {
    try {
      setIsLoading(true);
      return await authenticatedRequest(() => paymentService.getPaymentById(paymentId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento del pagamento';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest, toast]);

  /**
   * Scarica il PDF predefinito o un PDF specifico
   */
  const downloadPDF = useCallback(async (filename?: string): Promise<void> => {
    try {
      setIsLoading(true);
      const blob = await authenticatedRequest(() => paymentService.downloadPDF(filename));
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename
      const defaultFilename = filename || 'calc-boost-hub-guida.pdf';
      link.download = defaultFilename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Avviato",
        description: "Il PDF è stato scaricato con successo",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il download del PDF';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest, toast]);

  // Memoize the methods to prevent unnecessary re-renders
  const paymentMethods = useMemo(() => ({
    createPayment,
    getMyPayments,
    getMyPaymentSummary,
    getPaymentById,
    downloadPDF,
  }), [createPayment, getMyPayments, getMyPaymentSummary, getPaymentById, downloadPDF]);

  return {
    ...paymentMethods,
    payments,
    paymentSummary,
    isLoading,
  };
};

/**
 * Hook per gestire i pagamenti come amministratore
 */
export const useAdminPayments = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);

  // Wrapper per assicurarsi che l'utente sia admin
  const adminRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    if (!isAuthenticated || !isAdmin) {
      throw new Error('Admin access required for this operation');
    }
    return requestFn();
  }, [isAuthenticated, isAdmin]);

  /**
   * Ottiene tutti i pagamenti (solo per admin)
   */
  const getAllPayments = useCallback(async (
    page: number = 1,
    size: number = 20,
    paymentStatus?: string,
    userId?: number
  ): Promise<PaymentHistoryResponse> => {
    try {
      setIsLoading(true);
      const response = await adminRequest(() => 
        paymentService.getAllPayments(page, size, paymentStatus, userId)
      );
      
      setAllPayments(response.payments);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento dei pagamenti';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adminRequest, toast]);

  /**
   * Ottiene le statistiche dei pagamenti (solo per admin)
   */
  const getPaymentStats = useCallback(async (): Promise<PaymentStats> => {
    try {
      setIsLoading(true);
      const stats = await adminRequest(() => paymentService.getPaymentStats());
      setPaymentStats(stats);
      return stats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento delle statistiche';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adminRequest, toast]);

  /**
   * Aggiorna lo stato di un pagamento (solo per admin)
   */
  const updatePaymentStatus = useCallback(async (
    paymentId: number,
    status: Payment['status']
  ): Promise<Payment> => {
    try {
      setIsLoading(true);
      const updatedPayment = await adminRequest(() => 
        paymentService.updatePaymentStatus(paymentId, status)
      );
      
      // Aggiorna la lista locale
      setAllPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId ? updatedPayment : payment
        )
      );
      
      toast({
        title: "Stato Aggiornato",
        description: `Lo stato del pagamento è stato aggiornato a ${status}`,
      });
      
      return updatedPayment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'aggiornamento dello stato';
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adminRequest, toast]);

  // Memoize the methods to prevent unnecessary re-renders
  const adminPaymentMethods = useMemo(() => ({
    getAllPayments,
    getPaymentStats,
    updatePaymentStatus,
  }), [getAllPayments, getPaymentStats, updatePaymentStatus]);

  return {
    ...adminPaymentMethods,
    allPayments,
    paymentStats,
    isLoading,
    isAdmin,
  };
};

