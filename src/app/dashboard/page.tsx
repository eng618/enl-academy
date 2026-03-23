'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLandingPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [status, setStatus] = useState('Checking current session...');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setStatus('Not signed in. Please sign in to access your dashboard.');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error || !profile) {
        setStatus('Authenticated but profile not found. Please complete invite onboarding first.');
        return;
      }

      const role = profile.role;
      setStatus(`Redirecting to ${role} dashboard...`);
      router.replace(`/dashboard/${role === 'global_admin' ? 'global-admin' : role}`);
    };

    void load();
  }, [router, supabase]);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h3">
          Role Dashboard
        </Text>
        <Text>{status}</Text>
      </Card>
    </main>
  );
}
