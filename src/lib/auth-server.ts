import type { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

type AuthenticatedRequestUser = {
  accessToken: string;
  user: User;
};

type AuthenticatedRequestResult =
  | { ok: true; data: AuthenticatedRequestUser }
  | { ok: false; message: string; status: number };

export async function getAuthenticatedRequestUser(request: Request): Promise<AuthenticatedRequestResult> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, message: 'Missing bearer token.', status: 401 };
  }

  const accessToken = authHeader.slice('Bearer '.length).trim();
  if (!accessToken) {
    return { ok: false, message: 'Missing bearer token.', status: 401 };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false, message: 'Server auth configuration is missing.', status: 500 };
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return { ok: false, message: 'Invalid or expired session.', status: 401 };
  }

  return {
    ok: true,
    data: {
      accessToken,
      user: data.user,
    },
  };
}
