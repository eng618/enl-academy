import { getAuthenticatedRequestUser } from '@/lib/auth-server';
import { getRoleLandingPath } from '@/lib/role-landing';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Database } from '@/lib/supabase-types';
import { NextResponse } from 'next/server';

type AcceptInviteBody = {
  token?: string;
};

function getDefaultDisplayName(email: string | undefined): string {
  if (!email) {
    return 'New User';
  }

  const localPart = email.split('@')[0]?.trim();
  return localPart && localPart.length > 0 ? localPart : 'New User';
}

export async function POST(request: Request) {
  const authResult = await getAuthenticatedRequestUser(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const body = (await request.json()) as AcceptInviteBody;
  const token = body.token?.trim();

  if (!token) {
    return NextResponse.json({ error: 'Invite token is required.' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { data: existingProfile, error: existingError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', authResult.data.user.id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: `Failed to verify profile state: ${existingError.message}` }, { status: 500 });
  }

  if (existingProfile) {
    return NextResponse.json(
      {
        error: 'This account already has a profile. Invite acceptance is only for first-time profile setup.',
        redirectTo: getRoleLandingPath(existingProfile.role),
      },
      { status: 409 },
    );
  }

  const { data: invite, error: inviteError } = await supabase
    .from('invites')
    .select('id, email, family_id, role, accepted_at, expires_at')
    .eq('token', token)
    .single();

  if (inviteError || !invite) {
    return NextResponse.json({ error: 'Invite token is invalid.' }, { status: 404 });
  }

  if (invite.accepted_at) {
    return NextResponse.json({ error: 'Invite has already been used.' }, { status: 409 });
  }

  if (new Date(invite.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: 'Invite has expired.' }, { status: 410 });
  }

  const authEmail = authResult.data.user.email?.trim().toLowerCase();
  if (!authEmail || authEmail !== invite.email.toLowerCase()) {
    return NextResponse.json({ error: 'Signed-in account email does not match this invite.' }, { status: 403 });
  }

  const displayName =
    (authResult.data.user.user_metadata?.full_name as string | undefined) ||
    (authResult.data.user.user_metadata?.name as string | undefined) ||
    getDefaultDisplayName(authResult.data.user.email);

  const profileInsert: Database['public']['Tables']['profiles']['Insert'] = {
    user_id: authResult.data.user.id,
    family_id: invite.family_id,
    role: invite.role,
    display_name: displayName,
    grade_level: null,
  };

  const { error: profileInsertError } = await supabase.from('profiles').insert(profileInsert);

  if (profileInsertError) {
    return NextResponse.json({ error: `Failed to create profile: ${profileInsertError.message}` }, { status: 500 });
  }

  const { error: markAcceptedError } = await supabase
    .from('invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)
    .is('accepted_at', null);

  if (markAcceptedError) {
    return NextResponse.json(
      { error: `Profile created, but invite was not marked accepted: ${markAcceptedError.message}` },
      { status: 500 },
    );
  }

  const response = NextResponse.json({
    success: true,
    redirectTo: getRoleLandingPath(invite.role),
  });

  response.cookies.set('role', invite.role, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
