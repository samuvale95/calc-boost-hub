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

  // Registration approval (DAND Scale plan, point 4 — only relevant when
  // the backend's REQUIRE_MANUAL_APPROVAL is enabled)
  async approveUser(id: number): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.APPROVE_USER.replace('{id}', id.toString()), {
      method: 'PATCH',
    });
  }

  async rejectUser(id: number): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.REJECT_USER.replace('{id}', id.toString()), {
      method: 'PATCH',
    });
  }

  // Legacy: only works for pre-Firebase accounts that still have a local
  // password (see users.py's guard on this endpoint).
  async regeneratePassword(id: number): Promise<any> {
    return apiRequest(API_CONFIG.ENDPOINTS.REGENERATE_PASSWORD.replace('{id}', id.toString()), {
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
