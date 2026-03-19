'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Role } from '@/lib/supabase-types';
import { Button, Card, Input, Select, Text } from '@gv-tech/ui-web';
import { useState } from 'react';

const roleOptions: Role[] = ['admin', 'parent', 'student'];

export default function AdminInvitePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('parent');
  const [householdId, setHouseholdId] = useState('');
  const [message, setMessage] = useState('');
  const [inviteToken, setInviteToken] = useState('');

  const sendInvite = async () => {
    if (!email) {
      setMessage('Please provide an email');
      return;
    }

    const supabase = getBrowserSupabaseClient();
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

    const user = supabase.auth.getSession();

    const payload = {
      email,
      role,
      token,
      inviter_id: (await user).data.session?.user.id ?? 'unknown',
      household_id: householdId || null,
      expires_at: expiresAt,
      active: true,
    };

    const { error } = await supabase.from('invitations').insert(payload);

    if (error) {
      setMessage(`Invite create failed: ${error.message}`);
      return;
    }

    setInviteToken(token);
    setMessage('Invite created. Share this token with user.');
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Text as="h1" variant="h3" className="mb-4">
        Admin: Invite user
      </Text>
      <Card className="space-y-4 p-4">
        <div>
          <label>Email</label>
          <Input value={email} onChange={(e) => setEmail(e.currentTarget.value)} placeholder="user@example.com" />
        </div>
        <div>
          <label>Role</label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            {roleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label>Household ID (optional)</label>
          <Input
            value={householdId}
            onChange={(e) => setHouseholdId(e.currentTarget.value)}
            placeholder="household-uuid"
          />
        </div>
        <Button onClick={sendInvite}>Create Invite</Button>
        {message && <Text>{message}</Text>}
        {inviteToken && <Text>Invite token: {inviteToken}</Text>}
      </Card>
    </main>
  );
}
