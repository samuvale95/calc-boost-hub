// Usage counters (DAND Scale plan, point 6: "Monitoraggio dell'utilizzo").
// Fires best-effort: a failed/slow network call here must never block or
// break the calculator/download flow it's reporting on. Never send answers
// or scores — see the backend's app/models/usage_event.py.
import { API_CONFIG } from '@/config/api';
import { apiRequest } from './apiClient';

export type EventType =
  | 'calculator_started'
  | 'calculator_completed'
  | 'result_pdf_download'
  | 'result_excel_download'
  | 'scale_download'
  | 'manual_download'
  | 'other_download'
  | 'publication_download';

export interface PublicStats {
  calculator_uses: number;
  scale_downloads: number;
}

export const eventService = {
  /** Fire-and-forget: never throws, so a tracking failure can't surface as a user-facing error. */
  trackEvent(eventType: EventType, details?: Record<string, unknown>, lang?: string): void {
    apiRequest(API_CONFIG.ENDPOINTS.EVENTS, {
      method: 'POST',
      body: JSON.stringify({ event_type: eventType, lang, details }),
    }).catch((error) => {
      console.warn(`Impossibile registrare l'evento "${eventType}":`, error);
    });
  },

  async getPublicStats(): Promise<PublicStats> {
    return apiRequest<PublicStats>(API_CONFIG.ENDPOINTS.PUBLIC_STATS, { authenticated: false });
  },
};
