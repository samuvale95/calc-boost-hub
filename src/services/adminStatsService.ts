// Admin dashboard aggregates (DAND Scale plan, point 6).
import { apiRequest, apiDownload } from './apiClient';

export interface LabeledCount {
  label: string;
  count: number;
}

export interface TimeseriesPoint {
  period: string; // "YYYY-MM"
  event_type: string;
  count: number;
}

export interface AdminStats {
  users_total: number;
  users_pending: number;
  users_approved: number;
  users_rejected: number;
  calculator_starts: number;
  calculator_completions: number;
  scale_downloads: number;
  manual_downloads: number;
  result_pdf_downloads: number;
  result_excel_downloads: number;
  by_professional_role: LabeledCount[];
  by_country: LabeledCount[];
  by_language: LabeledCount[];
  timeseries: TimeseriesPoint[];
}

export interface StatsDateRange {
  fromDate?: string; // "YYYY-MM-DD"
  toDate?: string;
}

class AdminStatsService {
  async getStats({ fromDate, toDate }: StatsDateRange = {}): Promise<AdminStats> {
    const params = new URLSearchParams();
    if (fromDate) params.set('from_date', fromDate);
    if (toDate) params.set('to_date', toDate);
    const query = params.toString();
    return apiRequest<AdminStats>(`/admin/stats${query ? `?${query}` : ''}`);
  }

  /** Downloads the CSV of registered users, triggering a browser save. */
  async exportUsersCsv(): Promise<void> {
    const { blob, filename } = await apiDownload('/admin/users/export');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'dand-utenti.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const adminStatsService = new AdminStatsService();
