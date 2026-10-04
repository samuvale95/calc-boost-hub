import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuthService } from '@/services/firebaseAuthService';
import { authService, ProfileData } from '@/services/authService';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  center: string | null;
  professional_role: string | null;
  phone: string | null;
  country: string | null;
  preferred_language: string | null;
  is_active: boolean;
  registration_date: string;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** True once the user has filled in center/professional_role/phone (see completeProfile). */
  profileComplete: boolean;
  loading: boolean;
  tokenExpired: boolean;
  authError: string | null;
  clearAuthError: () => void;
  resendVerificationEmail: (email?: string) => Promise<void>;
  /** Sends the user a passwordless sign-in link (DAND Scale plan, point 5). */
  sendSignInLink: (email: string) => Promise<void>;
  /** Completes sign-in from a clicked email link. */
  completeSignIn: (email: string, url: string) => Promise<void>;
  /** Password fallback — sign in to an existing account. */
  signInWithPassword: (email: string, password: string) => Promise<void>;
  /** Password fallback — create a brand new account. */
  registerWithPassword: (email: string, password: string) => Promise<void>;
  /** Fills in the registration form fields for the signed-in user. */
  completeProfile: (data: ProfileData) => Promise<User>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Pulls the backend's copy of the profile for the currently signed-in
  // Firebase user. This is also what creates the local `users` row on a
  // person's very first sign-in (see get_current_user on the backend).
  const syncProfile = useCallback(async (): Promise<User | null> => {
    try {
      const profile = await authService.getCurrentUser();
      setUser(profile);
      setTokenExpired(false);
      setAuthError(null);
      return profile;
    } catch (error) {
      console.error('Profile sync failed:', error);
      const msg = error instanceof Error ? error.message : "Errore di sincronizzazione con il server";
      setUser(null);
      setTokenExpired(true);
      setAuthError(msg);
      throw error;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          await syncProfile();
        } catch {
          // Handled and stored in authError by syncProfile
        }
      } else {
        setUser(null);
        setAuthError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncProfile]);

  const sendSignInLink = async (email: string): Promise<void> => {
    await firebaseAuthService.sendSignInLink(email);
  };

  const completeSignIn = async (email: string, url: string): Promise<void> => {
    setLoading(true);
    try {
      const fbUser = await firebaseAuthService.completeSignInWithLink(email, url);
      setFirebaseUser(fbUser);
      await syncProfile();
    } finally {
      setLoading(false);
    }
  };

  const signInWithPassword = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const fbUser = await firebaseAuthService.signInWithPassword(email, password);
      setFirebaseUser(fbUser);
      await syncProfile();
    } finally {
      setLoading(false);
    }
  };

  const registerWithPassword = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const fbUser = await firebaseAuthService.registerWithPassword(email, password);
      setFirebaseUser(fbUser);
      try {
        await syncProfile();
      } catch {
        // Expected when email verification is required first
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email?: string): Promise<void> => {
    await firebaseAuthService.resendVerificationEmail(email || firebaseUser?.email || undefined);
  };

  const completeProfile = async (data: ProfileData): Promise<User> => {
    const profile = await authService.completeProfile(data);
    setUser(profile);
    return profile;
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      await firebaseAuthService.getIdToken(true);
      const profile = await syncProfile();
      return profile !== null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setTokenExpired(true);
      return false;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    await syncProfile();
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseAuthService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setFirebaseUser(null);
      setTokenExpired(false);
      setAuthError(null);
    }
  };

  const profileComplete = Boolean(user?.center && user?.professional_role);

  const value: AuthContextType = {
    user,
    firebaseUser,
    isAuthenticated: !!user && user.is_active && !tokenExpired,
    isAdmin: !!user && user.role?.toLowerCase() === 'admin' && !tokenExpired,
    profileComplete,
    loading,
    tokenExpired,
    authError,
    clearAuthError,
    resendVerificationEmail,
    sendSignInLink,
    completeSignIn,
    signInWithPassword,
    registerWithPassword,
    completeProfile,
    logout,
    refreshToken,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
