'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from '@gv-tech/ui-web';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const inviteEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type InviteFormValues = {
  email: string;
  role: 'parent' | 'student';
  familyId: string;
  expiresInDays: string;
};

export default function AdminInvitePage() {
  const supabase = getBrowserSupabaseClient();

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [families, setFamilies] = useState<Array<Database['public']['Tables']['families']['Row']>>([]);
  const [inviteUrl, setInviteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteFormValues>({
    defaultValues: {
      email: '',
      role: 'parent',
      familyId: '',
      expiresInDays: '7',
    },
    mode: 'onChange',
  });

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

        if (familiesData && familiesData.length > 0 && !form.getValues('familyId')) {
          form.setValue('familyId', familiesData[0].id, { shouldValidate: true });
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
  }, [form, supabase]);

  const selectedFamilyId = form.watch('familyId');
  const canManageInvites = Boolean(
    session && profile && (profile.role === 'global_admin' || profile.role === 'parent'),
  );
  const isFamilyValid = profile?.role === 'global_admin' ? Boolean(selectedFamilyId) : true;
  const isFormValid = canManageInvites && form.formState.isValid && isFamilyValid;

  const createInvite = async (values: InviteFormValues) => {
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

    const trimmedEmail = values.email.trim();
    const parsedExpires = Number(values.expiresInDays);

    const response = await fetch('/api/invites', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        email: trimmedEmail,
        role: values.role,
        familyId: profile.role === 'global_admin' ? values.familyId : undefined,
        expiresInDays: parsedExpires,
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
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(createInvite)}>
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Invitee email is required.',
                  validate: (value) => inviteEmailRegex.test(value.trim()) || 'Enter a valid email address.',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invitee email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Invitee email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                rules={{ required: 'Invite role is required.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite role</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invite role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">parent</SelectItem>
                          <SelectItem value="student">student</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {profile.role === 'global_admin' ? (
                <FormField
                  control={form.control}
                  name="familyId"
                  rules={{ required: 'Select a family before creating an invite.' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select family" />
                          </SelectTrigger>
                          <SelectContent>
                            {families.map((family) => (
                              <SelectItem key={family.id} value={family.id}>
                                {family.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="expiresInDays"
                rules={{
                  required: 'Expiration is required.',
                  validate: (value) => {
                    const parsed = Number(value);
                    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 30
                      ? true
                      : 'Expiration must be a whole number between 1 and 30.';
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite expiration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={30} step={1} placeholder="Expires in days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting || !isFormValid}>
                Create invite
              </Button>
            </form>
          </Form>
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
