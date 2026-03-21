import { NextRequest, NextResponse } from 'next/server';

// Protect /admin/* routes: only allow global_admin
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const role = request.cookies.get('role')?.value;
    if (role !== 'global_admin') {
      // Redirect to planner with error
      const url = request.nextUrl.clone();
      url.pathname = '/planner';
      url.searchParams.set('error', 'admin_only');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
