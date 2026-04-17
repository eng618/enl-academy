'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentDashboardPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setErrorMessage('You must sign in to access the dashboard.');
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('user_id', session.user.id)
        .single();

      if (error || !profile) {
        setErrorMessage('Profile not found. Complete invite onboarding first.');
        setLoading(false);
        return;
      }

      if (profile.role !== 'student') {
        setErrorMessage('Access denied: this page is only for students.');
        setTimeout(() => router.replace('/dashboard'), 1500);
        setLoading(false);
        return;
      }

      setDisplayName(profile.display_name);
      setLoading(false);
    };

    void load();
  }, [router, supabase]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Text>Loading your dashboard…</Text>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Card className="p-4">
          <Text>{errorMessage}</Text>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Text as="h1" variant="h3">
          Good day, {displayName}!
        </Text>
        <Text className="text-foreground/60 mt-1 text-sm">{today}</Text>
      </div>

      {/* Today's tasks — placeholder for slice 4 (Math-U-See curriculum + task generation) */}
      <Card className="space-y-3 p-4">
        <Text as="h2" variant="h4">
          Today's Tasks
        </Text>
        <div className="border-muted rounded-md border border-dashed p-6 text-center">
          <Text className="text-foreground/50 text-sm">No tasks scheduled yet.</Text>
          <Text className="text-foreground/40 mt-1 text-xs">
            Math curriculum tasks will appear here once your parent sets up your enrollment.
          </Text>
        </div>
      </Card>

      {/* Currently reading — placeholder for slice 6 (reading list) */}
      <Card className="space-y-3 p-4">
        <Text as="h2" variant="h4">
          Currently Reading
        </Text>
        <div className="border-muted rounded-md border border-dashed p-6 text-center">
          <Text className="text-foreground/50 text-sm">No books assigned yet.</Text>
          <Text className="text-foreground/40 mt-1 text-xs">
            Your reading list will appear here once your parent assigns books.
          </Text>
        </div>
      </Card>
    </main>
  );
}
