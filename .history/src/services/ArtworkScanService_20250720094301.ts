// Types for scan history and API responses
export interface ScanRecord {
  id: string;
  user_id: string;
  artwork_url: string;
  result: any;
  scan_timestamp: string;
  file_size: number;
  content_type: string;
  upload_url: string;
  public_id: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    public_id: string;
    filename: string;
    user_id: string;
    scan_id?: string;
    supabase_logged: boolean;
  };
  warning?: string;
}

export interface ScanHistoryResponse {
  success: boolean;
  data: ScanRecord[];
  pagination: {
    limit: number;
    offset: number;
    total_count: number;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    total_scans: number;
    total_file_size: number;
    average_file_size: number;
    period_days: number;
    scans_per_day: number;
  };
}

export interface SearchResponse {
  success: boolean;
  data: ScanRecord[];
  query: string;
  result_count: number;
}

export interface BatchDeleteResponse {
  success: boolean;
  message: string;
  deleted_count: number;
}

export interface UpdateScanRequest {
  scan_id: string;
  updates: Partial<ScanRecord>;
  user_id?: string;
}

export interface BatchDeleteRequest {
  scan_ids: string[];
  user_id?: string;
}

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ArtworkScanService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Helper method for making API requests
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Upload image with enhanced logging
  async uploadImage(
    imageFile: File,
    userId: string = 'anonymous',
    description: string = ''
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', userId);
    if (description) {
      formData.append('description', description);
    }

    const url = `${this.baseUrl}/upload/`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
    }

    return response.json();
  }

  // Get scan history with pagination
  async getScanHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ScanHistoryResponse> {
    const params = new URLSearchParams({
      user_id: userId,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    return this.makeRequest<ScanHistoryResponse>(`/scan-history/?${params}`);
  }

  // Get scan analytics
  async getScanAnalytics(
    userId: string,
    days: number = 30
  ): Promise<AnalyticsResponse> {
    const params = new URLSearchParams({
      user_id: userId,
      days: days.toString(),
    });

    return this.makeRequest<AnalyticsResponse>(`/analytics/?${params}`);
  }

  // Search scan history
  async searchScanHistory(
    userId: string,
    query: string,
    limit: number = 20
  ): Promise<SearchResponse> {
    const params = new URLSearchParams({
      user_id: userId,
      query,
      limit: limit.toString(),
    });

    return this.makeRequest<SearchResponse>(`/search/?${params}`);
  }

  // Get scan by ID
  async getScanById(scanId: string, userId?: string): Promise<{ success: boolean; data: ScanRecord }> {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }

    const queryString = params.toString();
    const endpoint = `/scan/${scanId}/${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<{ success: boolean; data: ScanRecord }>(endpoint);
  }

  // Update scan record
  async updateScan(request: UpdateScanRequest): Promise<{ success: boolean; message: string; data: ScanRecord }> {
    return this.makeRequest<{ success: boolean; message: string; data: ScanRecord }>(
      `/scan/${request.scan_id}/update/`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );
  }

  // Delete single scan
  async deleteScan(scanId: string, userId?: string): Promise<{ success: boolean; message: string; deleted_id: string }> {
    const params = new URLSearchParams({ scan_id: scanId });
    if (userId) {
      params.append('user_id', userId);
    }

    return this.makeRequest<{ success: boolean; message: string; deleted_id: string }>(
      `/delete-scan/?${params}`,
      { method: 'DELETE' }
    );
  }

  // Batch delete scans
  async batchDeleteScans(request: BatchDeleteRequest): Promise<BatchDeleteResponse> {
    return this.makeRequest<BatchDeleteResponse>('/batch-delete/', {
      method: 'DELETE',
      body: JSON.stringify(request),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; version: string }> {
    return this.makeRequest<{ status: string; message: string; version: string }>('/health/');
  }

  // Utility methods for common operations

  // Get all scans for a user (with automatic pagination)
  async getAllScans(userId: string, batchSize: number = 100): Promise<ScanRecord[]> {
    const allScans: ScanRecord[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getScanHistory(userId, batchSize, offset);
      allScans.push(...response.data);
      
      if (response.data.length < batchSize) {
        hasMore = false;
      } else {
        offset += batchSize;
      }
    }

    return allScans;
  }

  // Get scans by status
  async getScansByStatus(userId: string, status: string, limit: number = 50): Promise<ScanRecord[]> {
    const allScans = await this.getAllScans(userId, limit);
    return allScans.filter(scan => scan.status === status);
  }

  // Get scans by date range
  async getScansByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 50
  ): Promise<ScanRecord[]> {
    const allScans = await this.getAllScans(userId, limit);
    return allScans.filter(scan => {
      const scanDate = new Date(scan.created_at);
      return scanDate >= startDate && scanDate <= endDate;
    });
  }

  // Get total storage used by user
  async getTotalStorageUsed(userId: string): Promise<number> {
    const analytics = await this.getScanAnalytics(userId, 365); // Last year
    return analytics.data.total_file_size;
  }

  // Format file size for display
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Format date for display
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Get scan status color for UI
  static getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'uploaded':
        return 'blue';
      case 'processing':
        return 'yellow';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  }

  /**
   * Scan artwork and return classification results
   */
  static async scanArtwork(
    file: File
  ): Promise<{ label: string; confidence: number }> {
    try {
      // For development, use this mock response
      if (import.meta.env.DEV) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate random classification for demo purposes
        const labels = ["Handmade", "AI-Generated", "Digital"];
        const randomIndex = Math.floor(Math.random() * labels.length);
        const confidence = 0.7 + Math.random() * 0.29; // Between 0.7 and 0.99
        
        return {
          label: labels[randomIndex],
          confidence: confidence
        };
      }

      // In production, make actual API call
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        label: data.label,
        confidence: data.confidence,
      };
    } catch (error) {
      console.error("Error scanning artwork:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const artworkScanService = new ArtworkScanService();

// Export the class for custom instances
export default ArtworkScanService;

// Export the class as a named export as well
export { ArtworkScanService };
