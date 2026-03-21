'use client';

import { Card, Text } from '@gv-tech/ui-web';

export default function AdminInvitePage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h3">
          Invite Management
        </Text>
        <Text>
          This route is reserved for roadmap slice 2, when invite acceptance, auth callbacks, and role-derived profile
          creation are implemented together.
        </Text>
        <Text className="text-foreground/70 text-sm">
          Slice 1 establishes the families, profiles, invites, and RLS foundation first so invite writes can be added on
          a stable schema.
        </Text>
      </Card>
    </main>
  );
}
