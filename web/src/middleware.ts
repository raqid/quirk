import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('quirk_access_token')?.value;
  const offlineDemo = request.cookies.get('quirk_offline_demo')?.value;

  // Allow access if user has a token OR is in offline demo mode
  if (request.nextUrl.pathname.startsWith('/app') && !token && !offlineDemo) {
    // Don't redirect — let the client-side auth handle it
    // This allows localStorage-based offline demo to work
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login'],
};
