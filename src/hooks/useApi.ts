import { useCallback, useMemo } from 'react';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook per utilizzare il servizio API con autenticazione automatica
 * @returns {Object} Oggetto con metodi per chiamate API autenticate
 */
export const useApi = () => {
  const { isAuthenticated } = useAuth();

  // Wrapper per assicurarsi che l'utente sia autenticato
  const authenticatedRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to make this request');
    }
    return requestFn();
  }, [isAuthenticated]);

  // Memoize the API methods to prevent unnecessary re-renders
  const apiMethods = useMemo(() => ({
    // User management
    getUsers: () => authenticatedRequest(() => apiService.getUsers()),
    getUserById: (id: number) => authenticatedRequest(() => apiService.getUserById(id)),
    createUser: (userData: any) => authenticatedRequest(() => apiService.createUser(userData)),
    updateUser: (id: number, userData: any) => authenticatedRequest(() => apiService.updateUser(id, userData)),
    deleteUser: (id: number) => authenticatedRequest(() => apiService.deleteUser(id)),
    
    // User activation/deactivation
    activateUser: (id: number) => authenticatedRequest(() => apiService.activateUser(id)),
    deactivateUser: (id: number) => authenticatedRequest(() => apiService.deactivateUser(id)),
    
    // Password management
    regeneratePassword: (id: number) => authenticatedRequest(() => apiService.regeneratePassword(id)),
    
    // Generic request method
    request: <T>(endpoint: string, options?: RequestInit) => 
      authenticatedRequest(() => apiService.request<T>(endpoint, options)),
    
    // Direct access to apiService for non-authenticated requests
    apiService,
  }), [authenticatedRequest]);

  return apiMethods;
};
