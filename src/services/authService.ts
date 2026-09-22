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

class AuthService {
  /** Current user's profile — also what creates the local row on first sign-in. */
  async getCurrentUser(): Promise<User> {
    return apiRequest<User>(API_CONFIG.ENDPOINTS.CURRENT_USER);
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
