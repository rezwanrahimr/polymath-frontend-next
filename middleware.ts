import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect to /login if the root path ("/") is accessed
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow all other routes (including /login) to proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: '/', // Only match the root path
};