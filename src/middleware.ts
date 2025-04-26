import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  // Protected routes - redirect to login if no token
  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to dashboard if already logged in and trying to access login/register
  if ((path === '/login' || path === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*'],
};