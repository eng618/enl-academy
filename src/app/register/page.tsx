'use client';

import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';
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
import { useForm } from 'react-hook-form';

type RegisterFormValues = {
  token: string;
};

export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({
    defaultValues: { token: '' },
    mode: 'onChange',
  });

  const token = form.watch('token');

  return (
    <div className="text-foreground min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl p-6">
        <Card className="space-y-3 p-4">
          <Text as="h1" variant="h3">
            Registration
          </Text>
          <Text>Registration is invite-only. Paste your invite token or open your full invite link to continue.</Text>
          <Form {...form}>
            <form className="space-y-3">
              <FormField
                control={form.control}
                name="token"
                rules={{ required: 'Invite token is required.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite token</FormLabel>
                    <FormControl>
                      <Input placeholder="Paste your invite token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button asChild disabled={!token}>
                <Link href={token ? `/invite/${encodeURIComponent(token.trim())}` : '/register'}>
                  Continue with invite token
                </Link>
              </Button>
            </form>
          </Form>
          <Text className="text-foreground/70 text-sm">
            Already signed in? Your invite page will handle acceptance.
          </Text>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
