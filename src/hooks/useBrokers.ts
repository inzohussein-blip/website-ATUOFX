'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { Broker } from '@/types';

export function useBrokers() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrokers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Missing Supabase ENV');

      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      const rows = (data || []) as any[];
      setBrokers(rows.map((b: any) => ({
        ...b,
        features: Array.isArray(b.features) ? b.features : [],
        trading_platforms: Array.isArray(b.trading_platforms) ? b.trading_platforms : [],
      })) as Broker[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brokers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  const getBrokerById = useCallback(async (id: string) => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Missing Supabase ENV');

      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const b = data as any;
      return {
        ...b,
        features: Array.isArray(b?.features) ? b.features : [],
        trading_platforms: Array.isArray(b?.trading_platforms) ? b.trading_platforms : [],
      } as Broker;
    } catch (err) {
      console.error('Error fetching broker:', err);
      return null;
    }
  }, []);

  return {
    brokers,
    loading,
    error,
    fetchBrokers,
    getBrokerById,
  };
}
