'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentDashboardPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [status, setStatus] = useState('Loading student dashboard...');
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

      if (profile.role !== 'student') {
        setStatus('Access denied: this page is only for students.');
        setTimeout(() => router.replace('/dashboard'), 1500);
        return;
      }

      setProfileRole(profile.role);
      setStatus(`Welcome, ${profile.display_name ?? 'Student'}`);
    };

    void load();
  }, [router, supabase]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Card className="space-y-4 p-4">
        <Text as="h1" variant="h3">
          Student Dashboard
        </Text>
        <Text>{status}</Text>

        {profileRole === 'student' ? (
          <div className="space-y-2">
            <Text>Tasks available in this slice:</Text>
            <ul className="list-disc pl-5 text-sm">
              <li>View your profile and assigned family information</li>
              <li>Future: track assignments, grades, and attendance</li>
            </ul>
          </div>
        ) : null}
      </Card>
    </main>
  );
}
