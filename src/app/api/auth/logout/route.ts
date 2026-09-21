import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

// Pinned like the callback route - keeps the user on the same host the
// OAuth cookies were issued on instead of whatever request.url resolves to.
const APP_URL = process.env.APP_URL!;

export async function POST() {
  const response = NextResponse.redirect(new URL('/', APP_URL));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
