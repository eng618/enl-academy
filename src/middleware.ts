import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

function redirectWithCookies(url: URL, sourceResponse: NextResponse) {
  const response = NextResponse.redirect(url);

  for (const cookie of sourceResponse.cookies.getAll()) {
    response.cookies.set(cookie.name, cookie.value);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Supabase session refresh ---
  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  // Refresh session — getUser() triggers the token refresh
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Authentication gate: all matched routes require a valid session ---
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('next', pathname);
    return redirectWithCookies(url, supabaseResponse);
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle();

  const role = profile?.role ?? null;

  if (role) {
    supabaseResponse.cookies.set('role', role, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
  } else if (request.cookies.get('role')) {
    supabaseResponse.cookies.set('role', '', {
      path: '/',
      maxAge: 0,
    });
  }

  // /admin/invite is accessible to global_admin and parent
  if (pathname.startsWith('/admin/invite')) {
    if (role !== 'global_admin' && role !== 'parent') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      url.searchParams.set('error', 'unauthorized');
      return redirectWithCookies(url, supabaseResponse);
    }
  } else if (pathname.startsWith('/admin')) {
    // All other /admin routes require global_admin
    if (role !== 'global_admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      url.searchParams.set('error', 'admin_only');
      return redirectWithCookies(url, supabaseResponse);
    }
  }

  // Dashboard sub-route guards (/dashboard itself is open for role resolution)
  if (pathname.startsWith('/dashboard/global-admin') && role !== 'global_admin') {
    return redirectWithCookies(new URL('/dashboard', request.url), supabaseResponse);
  }

  if (pathname.startsWith('/dashboard/parent') && role !== 'parent') {
    return redirectWithCookies(new URL('/dashboard', request.url), supabaseResponse);
  }

  if (pathname.startsWith('/dashboard/student') && role !== 'student') {
    return redirectWithCookies(new URL('/dashboard', request.url), supabaseResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
