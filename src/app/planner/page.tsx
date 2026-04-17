'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
import { Button, Card, Input, Text } from '@gv-tech/ui-web';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function PlannerPage() {
  const supabase = getBrowserSupabaseClient();

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [family, setFamily] = useState<Database['public']['Tables']['families']['Row'] | null>(null);
  const [role, setRole] = useState<Database['public']['Tables']['profiles']['Row']['role'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const loadDashboard = async (nextSession: Session | null) => {
      setSession(nextSession);
      setProfile(null);
      setFamily(null);

      if (!nextSession) {
        setMessage('Sign in to verify your profile and family foundation setup.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', nextSession.user.id)
        .single();

      if (profileError || !profileData) {
        setMessage(
          'No profile is linked to this auth user yet. Seed the initial global admin profile in Supabase first.',
        );
        setIsLoading(false);
        return;
      }

      setProfile(profileData);
      setRole(profileData.role);

      if (!profileData.family_id) {
        setMessage('This profile exists but is not assigned to a family yet.');
        setIsLoading(false);
        return;
      }

      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('id', profileData.family_id)
        .single();

      if (familyError || !familyData) {
        setMessage('The linked family could not be loaded. Verify the family seed and RLS policies.');
        setIsLoading(false);
        return;
      }

      setFamily(familyData);
      setMessage('Foundation slice is active. Auth, profile, and family linkage are in place.');
      setIsLoading(false);
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      await loadDashboard(data.session);

      const { data: onAuthData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        void loadDashboard(nextSession);
      });

      subscription = onAuthData.subscription;
    };

    void init();

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const sendMagicLink = async () => {
    if (!authEmail) {
      setMessage('Email is required to request a magic link.');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email: authEmail });

    if (error) {
      setMessage(`Failed to request magic link: ${error.message}`);
      return;
    }

    setMessage('Magic link sent. Check your email to continue.');
  };

  const signInWithPassword = async () => {
    if (!authEmail || !authPassword) {
      setMessage('Email and password are required.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setMessage(`Password sign-in failed: ${error.message}`);
      return;
    }

    setMessage('Signed in successfully.');
  };

  const signOut = async () => {
    document.cookie = 'role=; path=/; max-age=0';
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(`Sign out failed: ${error.message}`);
      return;
    }

    setMessage('Signed out.');
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Text as="h1" variant="h3">
            Foundation Dashboard (legacy)
          </Text>
          <Text>
            Roadmap slice 1: families, profiles, roles, invites, and RLS. New role dashboards are at{' '}
            <a className="text-primary" href="/dashboard">
              /dashboard
            </a>
            .
          </Text>
        </div>
        {session ? <Button onClick={signOut}>Sign out</Button> : null}
      </div>

      {!session ? (
        <Card className="mb-4 space-y-3 p-4">
          <Text variant="h4">Sign in</Text>
          <Input
            type="email"
            value={authEmail}
            onChange={(event) => setAuthEmail(event.currentTarget.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={authPassword}
            onChange={(event) => setAuthPassword(event.currentTarget.value)}
            placeholder="Password"
          />
          <div className="flex gap-2">
            <Button onClick={signInWithPassword}>Sign in with password</Button>
            <Button variant="secondary" onClick={sendMagicLink}>
              Send magic link
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <Text variant="h4" className="mb-2">
            Auth
          </Text>
          <Text>{session?.user.email ?? 'Signed out'}</Text>
          <Text className="text-foreground/70 text-sm">
            Use this page to confirm the seeded auth user matches the linked profile row.
          </Text>
        </Card>

        <Card className="p-4">
          <Text variant="h4" className="mb-2">
            Profile
          </Text>
          {isLoading ? (
            <Text>Loading profile...</Text>
          ) : profile ? (
            <>
              <Text>{profile.display_name}</Text>
              <Text>Role: {profile.role}</Text>
              <Text>Grade level: {profile.grade_level ?? 'n/a'}</Text>
            </>
          ) : (
            <Text>No linked profile yet.</Text>
          )}
        </Card>

        <Card className="p-4">
          <Text variant="h4" className="mb-2">
            Family
          </Text>
          {isLoading ? (
            <Text>Loading family...</Text>
          ) : family ? (
            <>
              <Text>{family.name}</Text>
              <Text>Family ID: {family.id}</Text>
            </>
          ) : (
            <Text>No family linked yet.</Text>
          )}
        </Card>
      </div>

      <Card className="mt-4 p-4">
        <Text variant="h4" className="mb-2">
          Role-aware dashboard
        </Text>
        {role === 'global_admin' ? (
          <ul className="list-disc pl-5 text-sm">
            <li>Global admin action items: manage families, invites, and system settings.</li>
            <li>See user report summaries and audit logs (planned in next slice).</li>
          </ul>
        ) : role === 'parent' ? (
          <ul className="list-disc pl-5 text-sm">
            <li>Parent task board: monitor student progress and assign review items.</li>
            <li>Upcoming curriculum scheduling will land in Math-U-See slice.</li>
          </ul>
        ) : role === 'student' ? (
          <ul className="list-disc pl-5 text-sm">
            <li>Student view: upcoming assignments and completion status.</li>
            <li>Reading and attendance progress dashboards are coming in later slices.</li>
          </ul>
        ) : (
          <Text className="text-foreground/70 text-sm">
            Role-based dashboard content is unavailable until profile is loaded.
          </Text>
        )}
      </Card>
      <Card className="mt-4 p-4">
        <Text variant="h4" className="mb-2">
          Current slice status
        </Text>
        <ul className="list-disc pl-5 text-sm">
          <li>Canonical schema is now migration-based under supabase/migrations.</li>
          <li>RLS foundation is defined for families, profiles, and invites.</li>
          <li>Invite acceptance, student dashboards, curriculum, and planner scheduling remain in later slices.</li>
        </ul>
      </Card>

      {message ? <Text className="text-foreground/70 mt-4 text-sm">{message}</Text> : null}
    </main>
  );
}
