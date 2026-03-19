'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
import { Button, Input, Text } from '@gv-tech/ui-web';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [householdId, setHouseholdId] = useState('');
  const [message, setMessage] = useState('');
  const [allowSubmit, setAllowSubmit] = useState(false);

  useEffect(() => {
    const loadInvite = async () => {
      if (!token) {
        setMessage('Invite token missing');
        return;
      }

      const supabase = getBrowserSupabaseClient();
      const { data, error } = await supabase
        .from<Database['public']['Tables']['invitations']['Row']>('invitations')
        .select('*')
        .eq('token', token)
        .single();
      if (error || !data) {
        setMessage('Invalid or expired token');
        return;
      }

      if (!data.active || new Date(data.expires_at) < new Date()) {
        setMessage('Invitation is inactive or expired');
        return;
      }

      setEmail(data.email);
      setRole(data.role);
      setHouseholdId(data.household_id ?? '');
      setAllowSubmit(true);
    };
    loadInvite();
  }, [token]);

  const register = async () => {
    if (!allowSubmit) {
      setMessage('You cannot register yet');
      return;
    }

    const supabase = getBrowserSupabaseClient();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setMessage(`Signup failed: ${signUpError.message}`);
      return;
    }

    const user_id = signUpData.user?.id;
    if (!user_id) {
      setMessage('No user ID returned');
      return;
    }

    const { error: profileError } = await supabase
      .from<Database['public']['Tables']['profiles']['Row']>('profiles')
      .insert({
        user_id,
        email,
        role: role as 'admin' | 'parent' | 'student',
        household_id: householdId || null,
      } as Database['public']['Tables']['profiles']['Insert']);

    if (profileError) {
      setMessage(`Profile create failed: ${profileError.message}`);
      return;
    }

    await supabase
      .from('invitations')
      .update({ active: false, accepted_at: new Date().toISOString() })
      .eq('token', token);

    setMessage('Registration complete; please check email to confirm and sign in.');
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Text as="h1" variant="h3">
        Register
      </Text>
      <Text>Role: {role}</Text>
      <Text>Email: {email}</Text>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        placeholder="Password"
      />
      <Button onClick={register} disabled={!allowSubmit}>
        Complete registration
      </Button>
      {message && <Text>{message}</Text>}
    </main>
  );
}
