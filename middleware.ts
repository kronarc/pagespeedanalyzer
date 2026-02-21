import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Basic middleware - session/auth checks are done in route handlers and layout
  // Turbopack-compatible: No Prisma or heavy imports here
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
