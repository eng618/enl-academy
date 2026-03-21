import { getAuthenticatedRequestUser } from '@/lib/auth-server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Database, Role } from '@/lib/supabase-types';
import { NextResponse } from 'next/server';

type CreateInviteBody = {
  email?: string;
  role?: Role;
  familyId?: string;
  expiresInDays?: number;
};

function createInviteToken() {
  return crypto.randomUUID().replaceAll('-', '');
}

export async function POST(request: Request) {
  const authResult = await getAuthenticatedRequestUser(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const payload = (await request.json()) as CreateInviteBody;
  const email = payload.email?.trim().toLowerCase();
  const role = payload.role;
  const expiresInDaysRaw = payload.expiresInDays ?? 7;
  const expiresInDays = Math.max(1, Math.min(30, Math.floor(expiresInDaysRaw)));

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid invite email is required.' }, { status: 400 });
  }

  if (!role || (role !== 'parent' && role !== 'student')) {
    return NextResponse.json({ error: 'Role must be parent or student.' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { data: creatorProfile, error: creatorError } = await supabase
    .from('profiles')
    .select('id, role, family_id')
    .eq('user_id', authResult.data.user.id)
    .single();

  if (creatorError || !creatorProfile) {
    return NextResponse.json({ error: 'No profile found for the authenticated user.' }, { status: 403 });
  }

  const isGlobalAdmin = creatorProfile.role === 'global_admin';
  const isParent = creatorProfile.role === 'parent';

  if (!isGlobalAdmin && !isParent) {
    return NextResponse.json({ error: 'Only global admins and parents can create invites.' }, { status: 403 });
  }

  const familyId = isGlobalAdmin ? payload.familyId : creatorProfile.family_id;
  if (!familyId) {
    return NextResponse.json({ error: 'Family ID is required for this invite.' }, { status: 400 });
  }

  const { data: family, error: familyError } = await supabase.from('families').select('id').eq('id', familyId).single();

  if (familyError || !family) {
    return NextResponse.json({ error: 'Family not found.' }, { status: 404 });
  }

  const token = createInviteToken();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();

  const inviteInsert: Database['public']['Tables']['invites']['Insert'] = {
    email,
    family_id: familyId,
    role,
    created_by_profile_id: creatorProfile.id,
    token,
    expires_at: expiresAt,
  };

  const { data: invite, error: insertError } = await supabase
    .from('invites')
    .insert(inviteInsert)
    .select('id, email, role, family_id, expires_at, token')
    .single();

  if (insertError || !invite) {
    return NextResponse.json(
      { error: `Failed to create invite: ${insertError?.message ?? 'unknown error'}` },
      { status: 500 },
    );
  }

  const origin = new URL(request.url).origin;

  return NextResponse.json({
    invite,
    inviteUrl: `${origin}/invite/${invite.token}`,
  });
}
