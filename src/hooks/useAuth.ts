'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { User } from '@/types';
import type { Database } from '@/types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setUser(null);
      setLoading(false);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      const profile = profileData as ProfileRow | null;
      setUser({
        id: session.user.id,
        email: session.user.email!,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        is_admin: profile?.is_admin || false,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getUser();

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, is_admin')
          .eq('id', session.user.id)
          .maybeSingle();

        const profile = profileData as ProfileRow | null;
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: profile?.full_name || null,
          avatar_url: profile?.avatar_url || null,
          is_admin: profile?.is_admin || false,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [getUser]);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: new Error('Missing Supabase ENV') };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: new Error('Missing Supabase ENV'), data: null };

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error, data };
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: new Error('Missing Supabase ENV') };

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error };
  };

  return { user, loading, signIn, signUp, signOut, signInWithGoogle };
}
