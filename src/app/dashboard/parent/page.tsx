'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Button, Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ParentDashboardPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [status, setStatus] = useState('Loading parent dashboard...');
  const [profileRole, setProfileRole] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setStatus('You must sign in to access the dashboard.');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('user_id', session.user.id)
        .single();

      if (error || !profile) {
        setStatus('Profile not found. Complete invite onboarding first.');
        return;
      }

      if (profile.role !== 'parent') {
        setStatus('Access denied: this page is only for parents.');
        setTimeout(() => router.replace('/dashboard'), 1500);
        return;
      }

      setProfileRole(profile.role);
      setStatus(`Welcome, ${profile.display_name ?? 'Parent'}`);
    };

    void load();
  }, [router, supabase]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Card className="space-y-4 p-4">
        <Text as="h1" variant="h3">
          Parent Dashboard
        </Text>
        <Text>{status}</Text>

        {profileRole === 'parent' ? (
          <div className="space-y-2">
            <Text>Tasks available in this slice:</Text>
            <ul className="list-disc pl-5 text-sm">
              <li>View and create student invites</li>
              <li>Monitor assigned student progress (future slice)</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href="/admin/invite">Invite management</a>
              </Button>
              <Button asChild>
                <a href="/planner">Foundation dashboard</a>
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </main>
  );
}
