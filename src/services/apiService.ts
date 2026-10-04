import { API_CONFIG } from '@/config/api';
import { apiRequest } from './apiClient';

export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}

class ApiService {
  // User management endpoints (admin)
  async getUsers(): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.USERS);
  }

  async getUserById(id: number): Promise<any> {
    return apiRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
  }

  async createUser(userData: any): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any): Promise<any> {
    return apiRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<any> {
    return apiRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
      method: 'DELETE',
    });
  }

  // User activation/deactivation
  async activateUser(id: number): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.ACTIVATE_USER.replace('{id}', id.toString()), {
      method: 'PATCH',
    });
  }

  async deactivateUser(id: number): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.DEACTIVATE_USER.replace('{id}', id.toString()), {
      method: 'PATCH',
    });
  }

  // Token verification / sync
  async verifyToken(): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.VERIFY_TOKEN);
  }

  // Generic method for custom endpoints
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return apiRequest<T>(endpoint, options);
  }
}

export const apiService = new ApiService();
