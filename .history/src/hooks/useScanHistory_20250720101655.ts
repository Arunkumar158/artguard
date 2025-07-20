import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { ScanHistoryService, ScanHistoryRecord, ScanHistoryResponse } from '../services/ScanHistoryService';

interface UseScanHistoryReturn {
  scans: ScanHistoryRecord[];
  loading: boolean;
  error: string | null;
  user: User | null;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface UseScanHistoryOptions {
  limit?: number;
  autoLoad?: boolean;
}

export function useScanHistory(options: UseScanHistoryOptions = {}): UseScanHistoryReturn {
  const { limit = 50, autoLoad = true } = options;
  
  const [scans, setScans] = useState<ScanHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUser = useCallback(async (): Promise<User | null> => {
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error("Failed to get user session");
    }

    if (!currentUser) {
      throw new Error("Please sign in to view your scan history");
    }

    return currentUser;
  }, []);

  const fetchScanHistory = useCallback(async (currentUser: User, currentOffset: number = 0, isSearch: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      let data: ScanHistoryResponse;
      
      if (isSearch && searchQuery) {
        data = await ScanHistoryService.searchScans(currentUser.id, searchQuery, limit);
      } else {
        data = await ScanHistoryService.getScanHistory({
          user_id: currentUser.id,
          limit,
          offset: currentOffset
        });
      }

      const newScans = data.data || [];
      
      if (currentOffset === 0) {
        // First load or refresh
        setScans(newScans);
      } else {
        // Load more
        setScans(prev => [...prev, ...newScans]);
      }

      // Check if there are more results
      setHasMore(newScans.length === limit);
      setOffset(currentOffset + newScans.length);

    } catch (err) {
      console.error("Error fetching scan history:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limit, searchQuery]);

  const refresh = useCallback(async () => {
    if (!user) return;
    
    setOffset(0);
    setHasMore(true);
    await fetchScanHistory(user, 0, !!searchQuery);
  }, [user, fetchScanHistory, searchQuery]);

  const search = useCallback(async (query: string) => {
    if (!user) return;
    
    setSearchQuery(query);
    setOffset(0);
    setHasMore(true);
    await fetchScanHistory(user, 0, true);
  }, [user, fetchScanHistory]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setOffset(0);
    setHasMore(true);
    if (user) {
      fetchScanHistory(user, 0, false);
    }
  }, [user, fetchScanHistory]);

  const loadMore = useCallback(async () => {
    if (!user || loading || !hasMore) return;
    
    await fetchScanHistory(user, offset, !!searchQuery);
  }, [user, loading, hasMore, offset, fetchScanHistory, searchQuery]);

  // Initial load
  useEffect(() => {
    if (!autoLoad) return;

    const initialize = async () => {
      try {
        const currentUser = await fetchUser();
        setUser(currentUser);
        
        if (currentUser) {
          await fetchScanHistory(currentUser, 0, false);
        }
      } catch (err) {
        console.error("Error initializing scan history:", err);
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      }
    };

    initialize();
  }, [autoLoad, fetchUser, fetchScanHistory]);

  return {
    scans,
    loading,
    error,
    user,
    refresh,
    search,
    clearSearch,
    hasMore,
    loadMore,
  };
} 