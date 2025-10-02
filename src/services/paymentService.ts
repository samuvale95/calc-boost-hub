import { API_CONFIG, buildApiUrl } from '@/config/api';
import { authService } from './authService';
import { tokenService } from './tokenService';

export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payment_type: 'subscription' | 'pdf';
  subscription_type?: 'pdf' | 'annuale';
  subscription_duration_days?: number;
  description: string;
  is_renewal: boolean;
  auto_renewal_enabled: boolean;
  paypal_order_id?: string;
  paypal_payer_id?: string;
  paypal_transaction_id?: string;
  payment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentSummary {
  user_id: number;
  user_name: string;
  user_email: string;
  total_payments: number;
  total_spent: number;
  last_payment_date?: string;
  subscription_type?: string;
  subscription_expiry_date?: string;
  auto_renewal_enabled: boolean;
  is_subscription_active: boolean;
}

export interface PaymentHistoryResponse {
  payments: Payment[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaymentStats {
  total_payments: number;
  total_revenue: number;
  pending_payments: number;
  completed_payments: number;
  failed_payments: number;
  monthly_revenue: number;
  average_payment: number;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  subscription_type: 'pdf' | 'annuale';
  subscription_duration_days: number;
  description: string;
  is_renewal: boolean;
  auto_renewal_enabled: boolean;
  paypal_order_id: string;
  paypal_payer_id: string;
}

class PaymentService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = authService.getAuthToken();
    if (token) {
      // Check if token is expired locally first
      if (tokenService.isTokenExpired(token)) {
        throw new Error('Token expired');
      }
      
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          if (token) {
            const isValid = await tokenService.validateTokenWithAPI(token);
            if (!isValid) {
              throw new Error('Token invalid or expired');
            }
          }
          throw new Error('Unauthorized - please login again');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Crea un nuovo pagamento
   */
  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    return this.makeRequest<Payment>(API_CONFIG.ENDPOINTS.PAYMENTS, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  /**
   * Ottiene la cronologia pagamenti dell'utente corrente
   */
  async getMyPayments(
    page: number = 1,
    size: number = 10,
    paymentStatus?: string
  ): Promise<PaymentHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (paymentStatus) {
      params.append('payment_status', paymentStatus);
    }

    return this.makeRequest<PaymentHistoryResponse>(
      `${API_CONFIG.ENDPOINTS.MY_PAYMENTS}?${params.toString()}`
    );
  }

  /**
   * Ottiene il riepilogo pagamenti dell'utente corrente
   */
  async getMyPaymentSummary(): Promise<PaymentSummary> {
    return this.makeRequest<PaymentSummary>(API_CONFIG.ENDPOINTS.MY_PAYMENT_SUMMARY);
  }

  /**
   * Ottiene i dettagli di un pagamento specifico
   */
  async getPaymentById(paymentId: number): Promise<Payment> {
    return this.makeRequest<Payment>(
      API_CONFIG.ENDPOINTS.PAYMENT_BY_ID.replace('{id}', paymentId.toString())
    );
  }

  /**
   * Ottiene tutti i pagamenti (solo per admin)
   */
  async getAllPayments(
    page: number = 1,
    size: number = 20,
    paymentStatus?: string,
    userId?: number
  ): Promise<PaymentHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (paymentStatus) {
      params.append('payment_status', paymentStatus);
    }

    if (userId) {
      params.append('user_id', userId.toString());
    }

    return this.makeRequest<PaymentHistoryResponse>(
      `${API_CONFIG.ENDPOINTS.ALL_PAYMENTS}?${params.toString()}`
    );
  }

  /**
   * Ottiene le statistiche dei pagamenti (solo per admin)
   */
  async getPaymentStats(): Promise<PaymentStats> {
    return this.makeRequest<PaymentStats>(API_CONFIG.ENDPOINTS.PAYMENT_STATS);
  }

  /**
   * Aggiorna lo stato di un pagamento (solo per admin)
   */
  async updatePaymentStatus(
    paymentId: number,
    status: Payment['status']
  ): Promise<Payment> {
    return this.makeRequest<Payment>(
      `${API_CONFIG.ENDPOINTS.PAYMENT_BY_ID.replace('{id}', paymentId.toString())}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  }
}

export const paymentService = new PaymentService();

