import { mock } from 'bun:test';

// --- Mock factories ---

const validUser = {
  id: 'user-abc',
  email: 'test@example.com',
  user_metadata: { full_name: 'Test User' },
};

const validInvite = {
  id: 'invite-1',
  email: 'test@example.com',
  family_id: 'fam-1',
  role: 'parent' as const,
  accepted_at: null,
  expires_at: new Date(Date.now() + 86400_000).toISOString(),
};

let mockAuthResult: {
  ok: boolean;
  data?: { user: typeof validUser; accessToken: string };
  message?: string;
  status?: number;
};
let mockProfileSelect: { data: unknown; error: unknown };
let mockInviteSelect: { data: unknown; error: unknown };
let mockProfileInsert: { error: unknown };
let mockInviteUpdate: { error: unknown };

mock.module('@/lib/auth-server', () => ({
  getAuthenticatedRequestUser: async () => mockAuthResult,
}));

mock.module('@/lib/supabase-server', () => ({
  createSupabaseServerClient: () => {
    const chainable = (result: { data: unknown; error: unknown }) => ({
      select: () => ({
        eq: (_col: string, _val: string) => ({
          maybeSingle: async () => result,
          single: async () => result,
        }),
      }),
    });

    return {
      from: (table: string) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: (_col: string, _val: string) => ({
                maybeSingle: async () => mockProfileSelect,
                single: async () => mockProfileSelect,
              }),
            }),
            insert: async () => mockProfileInsert,
          };
        }
        if (table === 'invites') {
          return {
            ...chainable(mockInviteSelect),
            update: () => ({
              eq: (_col: string, _val: string) => ({
                is: async () => mockInviteUpdate,
              }),
            }),
          };
        }
        return chainable({ data: null, error: null });
      },
    };
  },
}));

// Dynamic import AFTER mocks are established
const { POST } = await import('@/app/api/invites/accept/route');

function createRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost:3000/api/invites/accept', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer test-token',
    },
    body: JSON.stringify(body),
  });
}

// --- Tests ---

describe('POST /api/invites/accept', () => {
  beforeEach(() => {
    mockAuthResult = { ok: true, data: { user: validUser, accessToken: 'test-token' } };
    mockProfileSelect = { data: null, error: null };
    mockInviteSelect = { data: { ...validInvite }, error: null };
    mockProfileInsert = { error: null };
    mockInviteUpdate = { error: null };
  });

  it('rejects unauthenticated requests', async () => {
    mockAuthResult = { ok: false, message: 'Missing bearer token.', status: 401 };
    const res = await POST(createRequest({ token: 'abc' }));
    expect(res.status).toBe(401);
  });

  it('rejects missing token in body', async () => {
    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('token');
  });

  it('rejects when user already has a profile', async () => {
    mockProfileSelect = { data: { id: 'p-1', role: 'parent' }, error: null };
    const res = await POST(createRequest({ token: 'abc' }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toContain('already has a profile');
  });

  it('rejects invalid/unknown token', async () => {
    mockInviteSelect = { data: null, error: { message: 'not found' } };
    const res = await POST(createRequest({ token: 'bad-token' }));
    expect(res.status).toBe(404);
  });

  it('rejects already-used invite', async () => {
    mockInviteSelect = {
      data: { ...validInvite, accepted_at: new Date().toISOString() },
      error: null,
    };
    const res = await POST(createRequest({ token: 'abc' }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toContain('already been used');
  });

  it('rejects expired invite', async () => {
    mockInviteSelect = {
      data: { ...validInvite, expires_at: new Date(Date.now() - 86400_000).toISOString() },
      error: null,
    };
    const res = await POST(createRequest({ token: 'abc' }));
    expect(res.status).toBe(410);
    const body = await res.json();
    expect(body.error).toContain('expired');
  });

  it('rejects email mismatch', async () => {
    mockAuthResult = {
      ok: true,
      data: { user: { ...validUser, email: 'other@example.com' }, accessToken: 'tok' },
    };
    const res = await POST(createRequest({ token: 'abc' }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('does not match');
  });

  it('succeeds and returns redirectTo with role cookie', async () => {
    const res = await POST(createRequest({ token: 'abc' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.redirectTo).toBe('/dashboard/parent');
    expect(res.headers.get('set-cookie')).toContain('role=parent');
  });
});
