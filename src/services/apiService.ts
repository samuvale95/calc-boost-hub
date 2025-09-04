import { API_CONFIG, buildApiUrl } from '@/config/api';
import { authService } from './authService';
import { tokenService } from './tokenService';

export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists (except for auth endpoints)
    const token = authService.getAuthToken();
    if (token && !endpoint.startsWith('/auth/')) {
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
          // Token might be invalid, try to verify it
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

  // User management endpoints
  async getUsers(): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.USERS);
  }

  async getUserById(id: number): Promise<any> {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
  }

  async createUser(userData: any): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any): Promise<any> {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<any> {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
      method: 'DELETE',
    });
  }

  // User activation/deactivation
  async activateUser(id: number): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.ACTIVATE_USER.replace('{id}', id.toString()), {
      method: 'PATCH',
    });
  }

  async deactivateUser(id: number): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.DEACTIVATE_USER.replace('{id}', id.toString()), {
      method: 'PATCH',
    });
  }

  // Password management
  async regeneratePassword(id: number): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.REGENERATE_PASSWORD.replace('{id}', id.toString()), {
      method: 'POST',
    });
  }

  // Token verification
  async verifyToken(): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.VERIFY_TOKEN);
  }

  // Generic method for custom endpoints
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, options);
  }
}

export const apiService = new ApiService();
