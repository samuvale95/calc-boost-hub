// Downloads for the DAND Scale and its manual (DAND Scale plan, point 5:
// gated by registration, not by payment).
import { API_CONFIG } from '@/config/api';
import { apiRequest, apiDownload } from './apiClient';

export interface PdfFileInfo {
  filename: string;
  size_bytes: number;
  size_mb: number;
  modified_date: string;
}

export interface PdfInfoResponse {
  available_pdfs: PdfFileInfo[];
  total_files: number;
  user_status: string;
  has_access: boolean;
}

class PdfService {
  async getInfo(): Promise<PdfInfoResponse> {
    return apiRequest<PdfInfoResponse>(API_CONFIG.ENDPOINTS.PDF_INFO);
  }

  /** Downloads one file and triggers a browser save. `filename` omitted downloads the default (first available) file. */
  async downloadFile(filename?: string): Promise<void> {
    const endpoint = filename
      ? `${API_CONFIG.ENDPOINTS.DOWNLOAD_PDF}?filename=${encodeURIComponent(filename)}`
      : API_CONFIG.ENDPOINTS.DOWNLOAD_PDF;

    const { blob, filename: serverFilename } = await apiDownload(endpoint);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = serverFilename || filename || 'D-DAND.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const pdfService = new PdfService();
