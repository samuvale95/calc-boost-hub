import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuthService } from '@/services/firebaseAuthService';
import { authService, ProfileData } from '@/services/authService';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  center: string | null;
  professional_role: string | null;
  phone: string | null;
  country: string | null;
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
  /** Sends the user a passwordless sign-in link (DAND Scale plan, point 5). */
  sendSignInLink: (email: string) => Promise<void>;
  /** Completes sign-in from a clicked email link. */
  completeSignIn: (email: string, url: string) => Promise<void>;
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

  // Pulls the backend's copy of the profile for the currently signed-in
  // Firebase user. This is also what creates the local `users` row on a
  // person's very first sign-in (see get_current_user on the backend).
  const syncProfile = useCallback(async (): Promise<User | null> => {
    try {
      const profile = await authService.getCurrentUser();
      setUser(profile);
      setTokenExpired(false);
      return profile;
    } catch (error) {
      console.error('Profile sync failed:', error);
      setUser(null);
      setTokenExpired(true);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await syncProfile();
      } else {
        setUser(null);
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
    }
  };

  const profileComplete = Boolean(user?.center && user?.professional_role);

  const value: AuthContextType = {
    user,
    firebaseUser,
    isAuthenticated: !!user && user.is_active && !tokenExpired,
    isAdmin: !!user && user.role === 'admin' && !tokenExpired,
    profileComplete,
    loading,
    tokenExpired,
    sendSignInLink,
    completeSignIn,
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
