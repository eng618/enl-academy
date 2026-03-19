import { createServerClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './supabase-types';

export function createSupabaseServerClient(req: Request, res: Response) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase server env configuration');
  }

  return createServerClient<Database>({ req, res, supabaseUrl, supabaseKey });
}
