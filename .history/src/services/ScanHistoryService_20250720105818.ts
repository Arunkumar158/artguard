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

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export class ScanHistoryService {
  private static baseUrl: string = API_BASE_URL;

  /**
   * Fetch scan history for a user
   */
  static async getScanHistory(params: ScanHistoryParams): Promise<ScanHistoryResponse> {
    const { user_id, limit = 50, offset = 0 } = params;
    
    const params = new URLSearchParams({
      user_id,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const url = `${this.baseUrl}/scan-history/?${params}`;

    const response = await fetch(url, {
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
    const params = new URLSearchParams({ scan_id: scanId });
    if (userId) {
      params.append('user_id', userId);
    }

    const url = `${this.baseUrl}/delete-scan/?${params}`;

    const response = await fetch(url, {
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
    const params = new URLSearchParams({
      user_id: userId,
      query,
      limit: limit.toString(),
    });

    const url = `${this.baseUrl}/search-scans/?${params}`;

    const response = await fetch(url, {
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
  static async getAnalytics(userId: string, days: number = 30): Promise<ScanAnalytics> {
    const params = new URLSearchParams({
      user_id: userId,
      days: days.toString(),
    });

    const url = `${this.baseUrl}/analytics/?${params}`;

    const response = await fetch(url, {
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