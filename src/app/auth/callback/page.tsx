'use client';

export const dynamic = 'force-dynamic';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function isSafeRedirectPath(path: string | null): path is string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');
}

export default function AuthCallbackPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [message, setMessage] = useState('Finalizing sign-in...');

  useEffect(() => {
    const finalizeAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      const redirectPath = isSafeRedirectPath(next) ? next : '/dashboard';

      const code = params.get('code');
      const errorDescription = params.get('error_description');

      if (errorDescription) {
        setMessage(`Sign-in failed: ${errorDescription}`);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(`Sign-in callback failed: ${error.message}`);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setMessage('No active session found. Please sign in again.');
        return;
      }

      router.replace(redirectPath);
    };

    void finalizeAuth();
  }, [router, supabase.auth]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h4">
          Auth callback
        </Text>
        <Text>{message}</Text>
      </Card>
    </main>
  );
}
