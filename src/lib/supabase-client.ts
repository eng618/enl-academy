import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

let supabase: SupabaseClient<Database> | null = null;

export const getBrowserSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
};
