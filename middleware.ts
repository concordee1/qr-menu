// middleware.ts (Reverted to Admin-Only Auth)

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set.");
      return new NextResponse('Server configuration error.', { status: 500 });
    }

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, password] = atob(authValue).split(':');

      if (password === adminPassword) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
