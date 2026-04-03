'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Review } from '@/types';

export function useReviews(brokerId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('reviews')
        .select(`*, profiles:user_id (full_name, avatar_url)`)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (brokerId) query = query.eq('broker_id', brokerId);
      const { data, error } = await query;
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [brokerId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const addReview = useCallback(async (brokerId: string, rating: number, comment: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({ broker_id: brokerId, user_id: userId, rating, comment, is_approved: false })
        .select().single();
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add review' };
    }
  }, []);

  const getUserReview = useCallback(async (brokerId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews').select('*').eq('broker_id', brokerId).eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching user review:', err);
      return null;
    }
  }, []);

  return { reviews, loading, error, fetchReviews, addReview, getUserReview };
}
