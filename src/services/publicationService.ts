// Publications added by admins (shown below the static ones on /publications).
import { API_CONFIG } from '@/config/api';
import { apiRequest } from './apiClient';

export interface ExtraPublication {
  id: number;
  title: string;
  url: string;
  citation: string;
  created_at: string;
}

export interface NewPublication {
  title: string;
  url: string;
  citation: string;
}

export const publicationService = {
  /** Public: oldest first, so a new one appears below the existing ones. */
  list(): Promise<ExtraPublication[]> {
    return apiRequest<ExtraPublication[]>(API_CONFIG.ENDPOINTS.PUBLICATIONS, { authenticated: false });
  },

  create(data: NewPublication): Promise<ExtraPublication> {
    return apiRequest<ExtraPublication>(API_CONFIG.ENDPOINTS.PUBLICATIONS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`${API_CONFIG.ENDPOINTS.PUBLICATIONS}/${id}`, { method: 'DELETE' });
  },
};
