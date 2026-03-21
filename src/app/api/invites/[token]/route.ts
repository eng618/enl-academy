import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ token: string }>;
};

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) {
    return 'hidden';
  }

  if (name.length <= 2) {
    return `${name[0] ?? '*'}*@${domain}`;
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  const supabase = createSupabaseServerClient();

  const { data: invite, error } = await supabase
    .from('invites')
    .select('email, role, family_id, expires_at, accepted_at')
    .eq('token', token)
    .single();

  if (error || !invite) {
    return NextResponse.json({ status: 'invalid' }, { status: 404 });
  }

  if (invite.accepted_at) {
    return NextResponse.json({ status: 'used' });
  }

  const expiresAt = new Date(invite.expires_at);
  if (expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ status: 'expired' });
  }

  return NextResponse.json({
    status: 'valid',
    invite: {
      role: invite.role,
      familyId: invite.family_id,
      emailHint: maskEmail(invite.email),
      expiresAt: invite.expires_at,
    },
  });
}
