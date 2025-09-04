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
      console.log('Making API request to:', url);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Network/API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Login doesn't require authentication, so we make a direct request
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
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

  // Logout method (if your API has a logout endpoint)
  async logout(): Promise<void> {
    try {
      // If your API has a logout endpoint, uncomment the following:
      // await this.makeRequest('/users/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      this.removeAuthToken();
    }
  }

  // Get current user profile (authenticated)
  async getCurrentUser(): Promise<any> {
    return this.makeRequest('/users/me');
  }

  // Update user profile (authenticated)
  async updateProfile(userData: any): Promise<any> {
    return this.makeRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

export const authService = new AuthService();
