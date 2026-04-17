'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
import { Button, Card, Input, Text } from '@gv-tech/ui-web';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function AdminInvitePage() {
  const supabase = getBrowserSupabaseClient();

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [families, setFamilies] = useState<Array<Database['public']['Tables']['families']['Row']>>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'parent' | 'student'>('parent');
  const [familyId, setFamilyId] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [inviteUrl, setInviteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const nextSession = sessionData.session;
      setSession(nextSession);

      if (!nextSession) {
        setProfile(null);
        setFamilies([]);
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', nextSession.user.id)
        .single();

      setProfile(profileData ?? null);

      if (profileData?.role === 'global_admin') {
        const { data: familiesData } = await supabase
          .from('families')
          .select('*')
          .order('created_at', { ascending: true });
        setFamilies(familiesData ?? []);

        if (familiesData && familiesData.length > 0 && !familyId) {
          setFamilyId(familiesData[0].id);
        }
      }

      const { data: authSubscriptionData } = supabase.auth.onAuthStateChange((_event, authSession) => {
        setSession(authSession);
      });

      subscription = authSubscriptionData.subscription;
    };

    void load();

    return () => {
      subscription?.unsubscribe();
    };
  }, [familyId, supabase]);

  const createInvite = async () => {
    if (!session) {
      setMessage('You must sign in first.');
      return;
    }

    if (!profile || (profile.role !== 'global_admin' && profile.role !== 'parent')) {
      setMessage('Only global admins and parents can create invites.');
      return;
    }

    setIsSubmitting(true);
    setInviteUrl('');

    const response = await fetch('/api/invites', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        email,
        role,
        familyId: profile.role === 'global_admin' ? familyId : undefined,
        expiresInDays,
      }),
    });

    const payload = (await response.json()) as { error?: string; inviteUrl?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(payload.error ?? 'Failed to create invite.');
      return;
    }

    setInviteUrl(payload.inviteUrl ?? '');
    setMessage('Invite created successfully.');
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h3">
          Invite Management
        </Text>

        {!session ? <Text>Sign in to create invites.</Text> : null}

        {session && (!profile || (profile.role !== 'global_admin' && profile.role !== 'parent')) ? (
          <Text>Only global admins and parents can create invites.</Text>
        ) : null}

        {session && profile && (profile.role === 'global_admin' || profile.role === 'parent') ? (
          <>
            <Input
              type="email"
              value={email}
              placeholder="Invitee email"
              onChange={(event) => setEmail(event.currentTarget.value)}
            />

            {/* fallback due to missing role-select component in @gv-tech/ui-web */}
            <label className="text-sm">
              Invite role
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={role}
                onChange={(event) => setRole(event.currentTarget.value as 'parent' | 'student')}
              >
                <option value="parent">parent</option>
                <option value="student">student</option>
              </select>
            </label>

            {profile.role === 'global_admin' ? (
              // fallback due to missing family-select component in @gv-tech/ui-web
              <label className="text-sm">
                Family
                <select
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={familyId}
                  onChange={(event) => setFamilyId(event.currentTarget.value)}
                >
                  <option value="">Select family</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <Input
              type="number"
              min={1}
              max={30}
              value={String(expiresInDays)}
              placeholder="Expires in days"
              onChange={(event) => setExpiresInDays(Number(event.currentTarget.value || 7))}
            />

            <Button disabled={isSubmitting} onClick={createInvite}>
              Create invite
            </Button>
          </>
        ) : null}

        {inviteUrl ? <Text>Invite URL: {inviteUrl}</Text> : null}
        {message ? <Text className="text-sm">{message}</Text> : null}

        <Text className="text-foreground/70 text-sm">
          Invite acceptance is enforced by token validity, expiration, and single-use status.
        </Text>
      </Card>
    </main>
  );
}
