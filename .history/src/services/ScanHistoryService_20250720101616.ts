import { User } from "@supabase/supabase-js";

// TypeScript interfaces for scan history data
export interface ScanHistoryRecord {
  id: string;
  user_id: string;
  artwork_url: string;
  result: {
    upload_url?: string;
    public_id?: string;
    filename?: string;
    file_size?: number;
    content_type?: string;
    description?: string;
    status?: string;
    confidence?: number;
    label?: string;
  };
  scan_timestamp: string;
  created_at: string;
  updated_at: string;
  file_size: number;
  content_type: string;
  upload_url: string;
  public_id: string;
  description: string;
  status: string;
}

export interface ScanHistoryResponse {
  success: boolean;
  data: ScanHistoryRecord[];
  pagination?: {
    limit: number;
    offset: number;
    total_count: number;
  };
}

export interface ScanHistoryParams {
  user_id: string;
  limit?: number;
  offset?: number;
}

export interface ScanAnalytics {
  total_scans: number;
  total_file_size: number;
  average_file_size: number;
  period_days: number;
  scans_per_day: number;
}

export class ScanHistoryService {
  private static readonly API_BASE_URL = '/api';

  /**
   * Fetch scan history for a user
   */
  static async getScanHistory(params: ScanHistoryParams): Promise<ScanHistoryResponse> {
    const { user_id, limit = 50, offset = 0 } = params;
    
    const url = new URL(`${this.API_BASE_URL}/scan-history/`);
    url.searchParams.append('user_id', user_id);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch scan history: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Delete a scan record
   */
  static async deleteScan(scanId: string, userId?: string): Promise<{ success: boolean; message: string }> {
    const url = new URL(`${this.API_BASE_URL}/delete-scan/`);
    url.searchParams.append('scan_id', scanId);
    if (userId) {
      url.searchParams.append('user_id', userId);
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete scan: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Search scan history
   */
  static async searchScans(userId: string, query: string, limit: number = 20): Promise<ScanHistoryResponse> {
    const url = new URL(`${this.API_BASE_URL}/search-scans/`);
    url.searchParams.append('user_id', userId);
    url.searchParams.append('query', query);
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search scans: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get scan analytics
   */
  static async getAnalytics(userId: string, days: number = 30): Promise<any> {
    const url = new URL(`${this.API_BASE_URL}/analytics/`);
    url.searchParams.append('user_id', userId);
    url.searchParams.append('days', days.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
} 