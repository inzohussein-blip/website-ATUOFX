'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponent } from '@/lib/supabase';
import { Broker } from '@/types';

export function useBrokers() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponent();

  const fetchBrokers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      setBrokers(data?.map(b => ({
        ...b,
        features: Array.isArray(b.features) ? b.features : [],
        trading_platforms: Array.isArray(b.trading_platforms) ? b.trading_platforms : [],
      })) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brokers');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  const getBrokerById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        features: Array.isArray(data.features) ? data.features : [],
        trading_platforms: Array.isArray(data.trading_platforms) ? data.trading_platforms : [],
      } as Broker;
    } catch (err) {
      console.error('Error fetching broker:', err);
      return null;
    }
  }, [supabase]);

  return {
    brokers,
    loading,
    error,
    fetchBrokers,
    getBrokerById,
  };
}
