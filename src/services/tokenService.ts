import { API_CONFIG, buildApiUrl } from '@/config/api';

export interface TokenVerificationResponse {
  valid: boolean;
  user_id?: number;
  email?: string;
  name?: string;
  role?: string;
  is_active?: boolean;
  message?: string;
}

export interface TokenInfo {
  isValid: boolean;
  userId?: number;
  email?: string;
  name?: string;
  role?: string;
  isActive?: boolean;
  expiresAt?: number;
}

class TokenService {
  private tokenCheckInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  /**
   * Verifica se il token è valido chiamando l'API
   */
  async verifyToken(token: string): Promise<TokenInfo> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.VERIFY_TOKEN), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: TokenVerificationResponse = await response.json();
        return {
          isValid: data.valid,
          userId: data.user_id,
          email: data.email,
          name: data.name,
          role: data.role,
          isActive: data.is_active,
        };
      } else {
        return { isValid: false };
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return { isValid: false };
    }
  }

  /**
   * Verifica se il token è scaduto localmente (senza chiamata API)
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  /**
   * Ottiene informazioni dal token senza chiamare l'API
   */
  getTokenInfo(token: string): TokenInfo | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        isValid: !this.isTokenExpired(token),
        userId: payload.sub ? parseInt(payload.sub) : undefined,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        isActive: payload.is_active,
        expiresAt: payload.exp,
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  /**
   * Avvia il controllo periodico del token
   */
  startTokenValidation(callback: (isValid: boolean) => void): void {
    this.stopTokenValidation();
    
    this.tokenCheckInterval = setInterval(async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const isValid = !this.isTokenExpired(token);
        if (!isValid) {
          callback(false);
        }
      } else {
        callback(false);
      }
    }, this.CHECK_INTERVAL);
  }

  /**
   * Ferma il controllo periodico del token
   */
  stopTokenValidation(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  /**
   * Verifica immediata del token con chiamata API
   */
  async validateTokenWithAPI(token: string): Promise<boolean> {
    const tokenInfo = await this.verifyToken(token);
    return tokenInfo.isValid;
  }

  /**
   * Ottiene il tempo rimanente prima della scadenza del token (in secondi)
   */
  getTokenTimeRemaining(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Controlla se il token scadrà presto (entro 5 minuti)
   */
  isTokenExpiringSoon(token: string): boolean {
    const timeRemaining = this.getTokenTimeRemaining(token);
    return timeRemaining > 0 && timeRemaining < 300; // 5 minutes
  }
}

export const tokenService = new TokenService();
