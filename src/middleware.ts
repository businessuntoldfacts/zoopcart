import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('zoopcart_admin_token')?.value;
    
    // If there is no token or it doesn't match our secret token, redirect to login
    if (adminToken !== "zoopcart_secure_master_key_2026") {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
