'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import { Button, Card, Input, Text } from '@gv-tech/ui-web';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function isSafeRedirectPath(path: string | null): path is string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');
}

export default function LoginPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState('/dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    setNextPath(isSafeRedirectPath(next) ? next : '/dashboard');
  }, []);

  useEffect(() => {
    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(nextPath);
      }
    };

    void syncSession();
  }, [nextPath, router, supabase.auth]);

  const signIn = async () => {
    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);

    if (error) {
      setMessage(`Sign-in failed: ${error.message}`);
      return;
    }

    router.replace(nextPath);
  };

  const signUp = async () => {
    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
    setIsSubmitting(false);

    if (error) {
      setMessage(`Sign-up failed: ${error.message}`);
      return;
    }

    setMessage('Sign-up submitted. Check your email to verify your account.');
  };

  const sendMagicLink = async () => {
    if (!email) {
      setMessage('Email is required.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
    setIsSubmitting(false);

    if (error) {
      setMessage(`Magic-link request failed: ${error.message}`);
      return;
    }

    setMessage('Magic link sent. Check your inbox.');
  };

  return (
    <main className="mx-auto max-w-xl p-6">
      <Card className="space-y-4 p-4">
        <Text as="h1" variant="h3">
          Sign in
        </Text>
        <Text className="text-foreground/70 text-sm">
          Invite onboarding is required for non-admin users. Sign in with the invited email and continue to your invite.
        </Text>

        <Input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <Input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(event) => setPassword(event.currentTarget.value)}
        />

        <div className="flex flex-wrap gap-2">
          <Button disabled={isSubmitting} onClick={signIn}>
            Sign in
          </Button>
          <Button disabled={isSubmitting} variant="secondary" onClick={signUp}>
            Sign up
          </Button>
          <Button disabled={isSubmitting} variant="ghost" onClick={sendMagicLink}>
            Send magic link
          </Button>
        </div>

        <Text className="text-foreground/70 text-sm">
          Have an invite link already? Open it directly (for example,{' '}
          <Link href="/invite/example">/invite/&lt;token&gt;</Link>).
        </Text>

        {message ? <Text className="text-sm">{message}</Text> : null}
      </Card>
    </main>
  );
}
