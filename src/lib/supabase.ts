import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

let _client: SupabaseClient<Database> | null = null;

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anon };
}

/**
 * عميل Supabase للواجهة (Client-Side).
 * 
 * - لا ننشئ العميل وقت import حتى لا ينهار build/prerender إذا كانت ENV ناقصة.
 * - يرجع null إذا لم تُضبط متغيرات البيئة.
 */
export function getSupabaseClient() {
  if (_client) return _client;

  const { url, anon } = getEnv();
  if (!url || !anon) return null;

  _client = createClient<Database>(url, anon, {
    auth: {
      persistSession: true,
      storageKey: 'forex-review-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}

// للتوافق مع الكود القديم
export const createClientComponent = () => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return client;
};
