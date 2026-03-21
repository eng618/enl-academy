'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Button, Card, Text } from '@gv-tech/ui-web';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type InviteStatus =
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'expired' }
  | { status: 'used' }
  | {
      status: 'valid';
      invite: {
        role: 'parent' | 'student';
        familyId: string;
        emailHint: string;
        expiresAt: string;
      };
    };

type InvitePageProps = {
  params: {
    token: string;
  };
};

export default function InviteTokenPage({ params }: InvitePageProps) {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<InviteStatus>({ status: 'loading' });
  const [message, setMessage] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const load = async () => {
      const [{ data: sessionData }, inviteResponse] = await Promise.all([
        supabase.auth.getSession(),
        fetch(`/api/invites/${params.token}`, { cache: 'no-store' }),
      ]);

      setSession(sessionData.session);

      if (!inviteResponse.ok) {
        setStatus({ status: 'invalid' });
      } else {
        const payload = (await inviteResponse.json()) as InviteStatus;
        setStatus(payload);
      }

      const { data: authSubscriptionData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
      });

      subscription = authSubscriptionData.subscription;
    };

    void load();

    return () => {
      subscription?.unsubscribe();
    };
  }, [params.token, supabase.auth]);

  const acceptInvite = async () => {
    if (!session) {
      setMessage('You must sign in first.');
      return;
    }

    setIsAccepting(true);
    const response = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ token: params.token }),
    });

    const payload = (await response.json()) as { error?: string; redirectTo?: string; success?: boolean };
    setIsAccepting(false);

    if (!response.ok) {
      setMessage(payload.error ?? 'Invite acceptance failed.');
      return;
    }

    router.replace(payload.redirectTo ?? '/planner');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h3">
          Invite acceptance
        </Text>

        {status.status === 'loading' ? <Text>Loading invite...</Text> : null}
        {status.status === 'invalid' ? <Text>This invite token is invalid.</Text> : null}
        {status.status === 'expired' ? <Text>This invite has expired. Ask for a new invite.</Text> : null}
        {status.status === 'used' ? <Text>This invite has already been used.</Text> : null}

        {status.status === 'valid' ? (
          <>
            <Text>Role: {status.invite.role}</Text>
            <Text>Email: {status.invite.emailHint}</Text>
            <Text>Expires: {new Date(status.invite.expiresAt).toLocaleString()}</Text>

            {session ? (
              <>
                <Text className="text-foreground/70 text-sm">Signed in as: {session.user.email}</Text>
                <div className="flex gap-2">
                  <Button disabled={isAccepting} onClick={acceptInvite}>
                    Accept invite
                  </Button>
                  <Button disabled={isAccepting} variant="secondary" onClick={signOut}>
                    Sign out
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild>
                <Link href={`/auth/login?next=${encodeURIComponent(`/invite/${params.token}`)}`}>
                  Sign in to continue
                </Link>
              </Button>
            )}
          </>
        ) : null}

        {message ? <Text className="text-sm">{message}</Text> : null}
      </Card>
    </main>
  );
}
