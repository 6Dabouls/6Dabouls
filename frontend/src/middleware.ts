import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/wallet', '/transactions', '/cards', '/payments', '/transfers', '/kyc', '/settings'];
const adminPaths = ['/admin'];
const authPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdmin = adminPaths.some((path) => pathname.startsWith(path));
  const isAuth = authPaths.some((path) => pathname.startsWith(path));

  // Check for token in cookies or we rely on client-side redirect
  // Since we use localStorage (not cookies), actual auth check is in layout components
  // This middleware handles basic route structure

  if (isProtected || isAdmin) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
