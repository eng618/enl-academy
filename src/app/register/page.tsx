'use client';

import { Button, Card, Input, Text } from '@gv-tech/ui-web';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [token, setToken] = useState('');

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h3">
          Registration
        </Text>
        <Text>Registration is invite-only. Paste your invite token or open your full invite link to continue.</Text>
        <Input
          value={token}
          placeholder="Invite token"
          onChange={(event) => setToken(event.currentTarget.value.trim())}
        />
        <Button asChild disabled={!token}>
          <Link href={token ? `/invite/${encodeURIComponent(token)}` : '/register'}>Continue with invite token</Link>
        </Button>
        <Text className="text-foreground/70 text-sm">Already signed in? Your invite page will handle acceptance.</Text>
      </Card>
    </main>
  );
}
