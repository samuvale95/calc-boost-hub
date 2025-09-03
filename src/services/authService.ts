import { API_CONFIG, buildApiUrl } from '@/config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    name: string;
    email: string;
    subscription: string;
    status: string;
    role: string;
    id: number;
    registration_date: string;
    last_access: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = this.getAuthToken();
    if (token) {
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

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.makeRequest<LoginResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Helper method to get auth token from localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Helper method to set auth token in localStorage
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Helper method to remove auth token from localStorage
  removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }
}

export const authService = new AuthService();
