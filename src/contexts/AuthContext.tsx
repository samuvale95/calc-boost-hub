import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginResponse } from '@/services/authService';
import { tokenService } from '@/services/tokenService';

interface User {
  id: number;
  email: string;
  name: string;
  subscription: string;
  status: string;
  role: string;
  registration_date: string;
  last_access: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  tokenExpired: boolean;
  refreshToken: () => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    const savedToken = authService.getAuthToken();
    
    if (savedUser && savedToken) {
      try {
        // Check if token is expired locally first
        if (tokenService.isTokenExpired(savedToken)) {
          console.log('Token expired locally');
          setTokenExpired(true);
          localStorage.removeItem('user');
          authService.removeAuthToken();
        } else {
          setUser(JSON.parse(savedUser));
          // Start token validation
          tokenService.startTokenValidation((isValid) => {
            if (!isValid) {
              setTokenExpired(true);
              setUser(null);
              localStorage.removeItem('user');
              authService.removeAuthToken();
            }
          });
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        authService.removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  // Cleanup token validation on unmount
  useEffect(() => {
    return () => {
      tokenService.stopTokenValidation();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response: LoginResponse = await authService.login(email, password);
      
      if (response.access_token && response.user) {
        // Save user data and token
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Save the access token
        authService.setAuthToken(response.access_token);
        
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    const token = authService.getAuthToken();
    if (!token) return false;

    try {
      const isValid = await tokenService.validateTokenWithAPI(token);
      if (isValid) {
        setTokenExpired(false);
        return true;
      } else {
        setTokenExpired(true);
        setUser(null);
        localStorage.removeItem('user');
        authService.removeAuthToken();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      setTokenExpired(true);
      setUser(null);
      localStorage.removeItem('user');
      authService.removeAuthToken();
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTokenExpired(false);
      localStorage.removeItem('user');
      tokenService.stopTokenValidation();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !tokenExpired,
    isAdmin: !!user && user.role === 'admin' && !tokenExpired,
    login,
    logout,
    loading,
    tokenExpired,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
