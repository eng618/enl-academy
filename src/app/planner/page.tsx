'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Button, Card, Text } from '@gv-tech/ui-web';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function PlannerPage() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = getBrowserSupabaseClient();
  const [message, setMessage] = useState('');

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const { data: onAuthData } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      subscription = onAuthData.subscription;
    };

    loadSession();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const sendMagicLink = async () => {
    const email = window.prompt('Enter your email for sign in');
    if (!email) {
      setMessage('Email is required to sign in.');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(`Failed to request magic link: ${error.message}`);
    } else {
      setMessage('Magic link sent. Check your email.');
    }
  };

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Text as="h1" variant="h3" className="mb-4">
          Homeschool Planner
        </Text>
        <Text className="mb-4">Sign in to access your combined calendar, blackout dates, and task planner.</Text>
        <Button onClick={sendMagicLink}>Send magic link</Button>
        {message && <p className="text-foreground/70 mt-3 text-sm">{message}</p>}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Text as="h1" variant="h3" className="mb-4">
        Homeschool Planner
      </Text>
      <Text className="mb-2">Welcome, {session.user.email ?? 'parent'}.</Text>
      <Card className="mt-4 p-4">
        <Text variant="h4" className="mb-2">
          Parent mode is active (initial MVP)
        </Text>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Blackout dates (vacations, holidays)</li>
          <li>Combined curriculum calendar</li>
          <li>Individual student year calendar</li>
          <li>Daily planner with checkmarks</li>
        </ul>
      </Card>
      <Text className="text-foreground/70 mt-4 text-sm">
        (This is an MVP placeholder page. Build specific planner components in next PR.)
      </Text>
    </main>
  );
}
