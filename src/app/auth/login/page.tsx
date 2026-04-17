'use client';

import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';
import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Text,
} from '@gv-tech/ui-web';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const loginEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginFormValues = {
  email: string;
  password: string;
};

function isSafeRedirectPath(path: string | null): path is string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');
}

export default function LoginPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState('/dashboard');

  const form = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

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

  const signIn = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
    setIsSubmitting(false);

    if (error) {
      setMessage(`Sign-in failed: ${error.message}`);
      return;
    }

    router.replace(nextPath);
  };

  const signUp = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
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
    const emailValid = await form.trigger('email');
    if (!emailValid) {
      return;
    }

    const { email } = form.getValues();
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
    <div className="text-foreground min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl p-6">
        <Card className="space-y-4 p-4">
          <Text as="h1" variant="h3">
            Sign in
          </Text>
          <Text className="text-foreground/70 text-sm">
            Invite onboarding is required for non-admin users. Sign in with the invited email and continue to your
            invite.
          </Text>

          <Form {...form}>
            <form className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Email is required.',
                  validate: (value) => loginEmailRegex.test(value.trim()) || 'Enter a valid email address.',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{ required: 'Password is required.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-2">
                <Button type="button" disabled={isSubmitting} onClick={() => void form.handleSubmit(signIn)()}>
                  Sign in
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  variant="secondary"
                  onClick={() => void form.handleSubmit(signUp)()}
                >
                  Sign up
                </Button>
                <Button type="button" disabled={isSubmitting} variant="ghost" onClick={() => void sendMagicLink()}>
                  Send magic link
                </Button>
              </div>
            </form>
          </Form>

          <Text className="text-foreground/70 text-sm">
            Have an invite link already? Open it directly (for example,{' '}
            <Link href="/invite/example">/invite/&lt;token&gt;</Link>).
          </Text>

          {message ? <Text className="text-sm">{message}</Text> : null}
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
