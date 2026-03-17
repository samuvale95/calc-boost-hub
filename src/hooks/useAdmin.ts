import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook per gestire i permessi di amministratore
 * @returns {Object} Oggetto con funzioni e stati per la gestione admin
 */
export const useAdmin = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();

  /**
   * Verifica se l'utente è un amministratore
   * @returns {boolean} True se l'utente è admin
   */
  const isUserAdmin = (): boolean => {
    return isAuthenticated && (user?.role === 'admin' || isAdmin);
  };

  /**
   * Verifica se l'utente ha un determinato permesso
   * @param {string} permission - Il permesso da verificare
   * @returns {boolean} True se l'utente ha il permesso
   */
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated) return false;
    
    // Gli admin hanno tutti i permessi
    if (user?.role === 'admin' || isAdmin) return true;
    
    // Qui puoi aggiungere logica per altri tipi di permessi
    // basati su subscription, status, etc.
    switch (permission) {
      case 'view_quiz':
        return user?.status === 'active';
      case 'access_admin':
        return user?.role === 'admin' || isAdmin;
      default:
        return false;
    }
  };

  /**
   * Verifica se l'utente può accedere a una determinata sezione
   * @param {string} section - La sezione da verificare
   * @returns {boolean} True se l'utente può accedere
   */
  const canAccess = (section: string): boolean => {
    switch (section) {
      case 'admin':
      case 'dashboard':
        return user?.role === 'admin' || isUserAdmin();
      case 'quiz':
        return isAuthenticated && user?.status === 'active';
      default:
        return isAuthenticated;
    }
  };

  /**
   * Ottiene il livello di accesso dell'utente
   * @returns {string} Il livello di accesso
   */
  const getAccessLevel = (): string => {
    if (!isAuthenticated) return 'guest';
    if (user?.role === 'admin' || isAdmin) return 'admin';
    if (user?.status === 'active') return 'user';
    return 'inactive';
  };

  return {
    isUserAdmin,
    hasPermission,
    canAccess,
    getAccessLevel,
    isAdmin,
    user,
    isAuthenticated
  };
};
