'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
import { Button, Card, Text } from '@gv-tech/ui-web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Family = Database['public']['Tables']['families']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

type FamilyWithProfiles = Family & { profiles: Profile[] };

export default function GlobalAdminDashboardPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [families, setFamilies] = useState<FamilyWithProfiles[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setErrorMessage('You must sign in to access the dashboard.');
        setLoading(false);
        return;
      }

      const { data: adminProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !adminProfile) {
        setErrorMessage('Profile not found. Complete invite onboarding first.');
        setLoading(false);
        return;
      }

      if (adminProfile.role !== 'global_admin') {
        setErrorMessage('Access denied: this page is only for global admins.');
        setTimeout(() => router.replace('/dashboard'), 1500);
        setLoading(false);
        return;
      }

      setDisplayName(adminProfile.display_name);

      const { data: familyRows, error: familiesError } = await supabase
        .from('families')
        .select('*')
        .order('created_at', { ascending: true });

      if (familiesError || !familyRows) {
        setErrorMessage('Failed to load families.');
        setLoading(false);
        return;
      }

      const { data: profileRows } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name', { ascending: true });

      const profilesByFamily = (profileRows ?? []).reduce<Record<string, Profile[]>>((acc, p) => {
        const fid = p.family_id ?? '__none__';
        acc[fid] = acc[fid] ? [...acc[fid], p] : [p];
        return acc;
      }, {});

      setFamilies(familyRows.map((f) => ({ ...f, profiles: profilesByFamily[f.id] ?? [] })));
      setLoading(false);
    };

    void load();
  }, [router, supabase]);

  const selectedProfile = selectedProfileId
    ? (families.flatMap((f) => f.profiles).find((p) => p.id === selectedProfileId) ?? null)
    : null;

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Text>Loading admin dashboard…</Text>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Card className="p-4">
          <Text>{errorMessage}</Text>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Text as="h1" variant="h3">
          Admin — {displayName}
        </Text>
        <Button asChild size="sm">
          <a href="/admin/invite">+ New invite</a>
        </Button>
      </div>

      {families.length === 0 ? (
        <Card className="p-4">
          <Text>No families found. Seed your initial family to get started.</Text>
        </Card>
      ) : (
        families.map((family) => (
          <Card key={family.id} className="space-y-3 p-4">
            <Text as="h2" variant="h4">
              {family.name}
            </Text>

            {family.profiles.length === 0 ? (
              <Text className="text-foreground/60 text-sm">No profiles in this family yet.</Text>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pr-4 pb-2 font-medium">Name</th>
                      <th className="pr-4 pb-2 font-medium">Role</th>
                      <th className="pr-4 pb-2 font-medium">Grade</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {family.profiles.map((profile) => (
                      <tr key={profile.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{profile.display_name}</td>
                        <td className="py-2 pr-4">
                          <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">{profile.role}</span>
                        </td>
                        <td className="py-2 pr-4">{profile.grade_level ?? '—'}</td>
                        <td className="py-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedProfileId(selectedProfileId === profile.id ? null : profile.id)}
                          >
                            {selectedProfileId === profile.id ? 'Hide' : 'View'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedProfile && family.profiles.some((p) => p.id === selectedProfile.id) ? (
              <Card className="bg-muted/40 space-y-1 p-3 text-sm">
                <Text className="font-medium">Profile detail — {selectedProfile.display_name}</Text>
                <Text>Role: {selectedProfile.role}</Text>
                <Text>Grade: {selectedProfile.grade_level ?? 'N/A'}</Text>
                <Text>User ID: {selectedProfile.user_id}</Text>
                <Text>Joined: {new Date(selectedProfile.created_at).toLocaleDateString()}</Text>
              </Card>
            ) : null}
          </Card>
        ))
      )}
    </main>
  );
}
