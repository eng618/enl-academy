'use client';

import { Card, Text } from '@gv-tech/ui-web';

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h3">
          Registration
        </Text>
        <Text>
          Invite acceptance and registration are scheduled for roadmap slice 2. The current slice focuses on the
          database foundation and tenant-safe access model.
        </Text>
        <Text className="text-foreground/70 text-sm">
          After slice 2 lands, this route will validate invite tokens, create the linked profile, and redirect by role.
        </Text>
      </Card>
    </main>
  );
}
