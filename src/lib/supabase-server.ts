import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase server env configuration');
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}
