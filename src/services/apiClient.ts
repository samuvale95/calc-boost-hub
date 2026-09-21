// Shared authenticated fetch helper.
//
// Every backend call that needs auth attaches the current Firebase ID
// token as a Bearer token — the backend verifies it directly (see
// get_current_user in the backend's app/api/v1/endpoints/auth.py); there
// is no separate app-issued token to manage on this side any more.
import { buildApiUrl } from '@/config/api';
import { firebaseAuthService } from './firebaseAuthService';

export class ApiRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

interface ApiRequestOptions extends RequestInit {
  /** Set to false for public endpoints (e.g. check-email) that don't need a token. */
  authenticated?: boolean;
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { authenticated = true, ...init } = options;
  const url = buildApiUrl(endpoint);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };

  if (authenticated) {
    const token = await firebaseAuthService.getIdToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, { ...init, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
    throw new ApiRequestError(typeof message === 'string' ? message : JSON.stringify(message), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/** Downloads a binary file (e.g. the scale/manual PDF) as a Blob, authenticated the same way as apiRequest. */
export async function apiDownload(endpoint: string): Promise<{ blob: Blob; filename: string | null }> {
  const url = buildApiUrl(endpoint);
  const token = await firebaseAuthService.getIdToken();

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
    throw new ApiRequestError(typeof message === 'string' ? message : JSON.stringify(message), response.status);
  }

  const disposition = response.headers.get('Content-Disposition');
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);

  return { blob: await response.blob(), filename: filenameMatch?.[1] ?? null };
}
