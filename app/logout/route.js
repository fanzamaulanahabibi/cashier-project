import { NextResponse } from 'next/server';
import { clearSession } from '../../lib/auth.js';

export async function GET(req) {
  clearSession();
  return NextResponse.redirect(new URL('/login', req.url));
}

