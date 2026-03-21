'use client';

import { Card, Text } from '@gv-tech/ui-web';

export default function AdminStudentsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <Card className="space-y-3 p-4">
        <Text as="h1" variant="h3">
          Student Management
        </Text>
        <Text>
          Student records arrive after the first foundation slices. Families, profiles, roles, invites, and auth
          onboarding need to be in place before student CRUD becomes reliable.
        </Text>
        <Text className="text-foreground/70 text-sm">
          This page will be activated in the role dashboard and curriculum slices.
        </Text>
      </Card>
    </main>
  );
}
