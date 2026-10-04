import { API_CONFIG } from '@/config/api';
import { apiRequest } from './apiClient';
import type { User } from '@/contexts/AuthContext';

export interface ProfileData {
  name?: string;
  center: string;
  professional_role: string;
  phone: string;
  country?: string;
  preferred_language?: string;
  accepted_terms: boolean;
  accepted_privacy: boolean;
}

/** Who sends the reset email: our backend (SMTP) or Firebase's standard email (fallback). */
export type PasswordResetDelivery = 'backend' | 'firebase';

class AuthService {
  /** Current user's profile — also what creates the local row on first sign-in. */
  async getCurrentUser(): Promise<User> {
    return apiRequest<User>(API_CONFIG.ENDPOINTS.CURRENT_USER);
  }

  /**
   * Starts password recovery: the backend emails a link to /reset-password.
   * Public (no token) and always succeeds the same way whether or not the
   * email has an account.
   */
  async requestPasswordReset(email: string, lang: string): Promise<PasswordResetDelivery> {
    return apiRequest<{ delivery: PasswordResetDelivery }>(API_CONFIG.ENDPOINTS.PASSWORD_RESET, {
      method: 'POST',
      authenticated: false,
      body: JSON.stringify({ email, lang: lang.slice(0, 2) }),
    }).then((response) => response.delivery);
  }

  /** Completes the registration form (DAND Scale plan, point 4). */
  async completeProfile(data: ProfileData): Promise<User> {
    return apiRequest<User>(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** Pre-flight check before sending a sign-in link, purely for UX copy (Firebase itself is the source of truth). */
  async checkEmailExists(email: string): Promise<boolean> {
    const response = await apiRequest<{ exists: boolean }>(
      `${API_CONFIG.ENDPOINTS.CHECK_EMAIL}?email=${encodeURIComponent(email)}`,
      { authenticated: false }
    );
    return response.exists;
  }
}

export const authService = new AuthService();
