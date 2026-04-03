import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// instance واحد فقط للتطبيق كله
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'forex-review-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// للتوافق مع الكود القديم
export const createClientComponent = () => supabase;
