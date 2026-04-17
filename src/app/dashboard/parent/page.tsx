'use client';

export const dynamic = 'force-dynamic';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
import { Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type StudentProfile = Database['public']['Tables']['profiles']['Row'];

export default function ParentDashboardPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, display_name, family_id')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profile) {
        setErrorMessage('Profile not found. Complete invite onboarding first.');
        setLoading(false);
        return;
      }

      if (profile.role !== 'parent') {
        setErrorMessage('Access denied: this page is only for parents.');
        setTimeout(() => router.replace('/dashboard'), 1500);
        setLoading(false);
        return;
      }

      setDisplayName(profile.display_name);

      if (profile.family_id) {
        const { data: studentRows } = await supabase
          .from('profiles')
          .select('*')
          .eq('family_id', profile.family_id)
          .eq('role', 'student')
          .order('display_name', { ascending: true });

        setStudents(studentRows ?? []);
      }

      setLoading(false);
    };

    void load();
  }, [router, supabase]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Text>Loading parent dashboard…</Text>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Card className="p-4">
          <Text>{errorMessage}</Text>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <Text as="h1" variant="h3">
        Parent — {displayName}
      </Text>

      <section>
        <Text as="h2" variant="h4" className="mb-3">
          Students
        </Text>

        {students.length === 0 ? (
          <Card className="p-4">
            <Text>No students in your family yet. Invite a student to get started.</Text>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <Card key={student.id} className="space-y-2 p-4">
                <Text as="h3" variant="h4">
                  {student.display_name}
                </Text>
                {student.grade_level ? (
                  <Text className="text-foreground/70 text-sm">Grade: {student.grade_level}</Text>
                ) : null}
                <div className="space-y-1 pt-2 text-sm">
                  <Text className="text-foreground/50 text-xs font-medium tracking-wide uppercase">Coming soon</Text>
                  <Text className="text-foreground/60 text-sm">📚 Math curriculum (slice 4)</Text>
                  <Text className="text-foreground/60 text-sm">📖 Reading list (slice 6)</Text>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
