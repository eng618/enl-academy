'use client';

import { SiteHeader } from '@/components/site/header';
import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Button, Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GlobalAdminDashboardPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [status, setStatus] = useState('Loading admin dashboard...');
  const [profileRole, setProfileRole] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setStatus('You must sign in to access the dashboard.');
        setProfileRole(null);
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

      if (profile.role !== 'global_admin') {
        setStatus('Access denied: this page is only for global admins.');
        setTimeout(() => router.replace('/dashboard'), 1500);
        return;
      }

      setProfileRole(profile.role);
      setStatus(`Welcome, ${profile.display_name ?? 'Administrator'}`);
    };

    void load();
  }, [router, supabase]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <SiteHeader />
      <Card className="space-y-4 p-4">
        <Text as="h1" variant="h3">
          Global Admin Dashboard
        </Text>
        <Text>{status}</Text>

        {profileRole === 'global_admin' ? (
          <div className="space-y-2">
            <Text>Tasks available in this slice:</Text>
            <ul className="list-disc pl-5 text-sm">
              <li>Manage families and invites</li>
              <li>View/seed initial profile and family data</li>
              <li>Navigate to admin task pages</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href="/admin/invite">Invite management</a>
              </Button>
              <Button asChild>
                <a href="/admin/students">Student management</a>
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
