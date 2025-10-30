import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, schema } from '../../../lib/db.js';
import { getSessionUser } from '../../../lib/auth.js';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  const currentUser = await getSessionUser();
  if (!currentUser) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (currentUser.role !== 'admin') {
    const url = new URL('/users', req.url);
    url.searchParams.set('error', 'forbidden');
    return NextResponse.redirect(url);
  }

  const form = await req.formData();
  const username = String(form.get('username') || '').trim();
  const password = String(form.get('password') || '');
  let role = String(form.get('role') || 'cashier').trim().toLowerCase();

  if (!['admin', 'cashier'].includes(role)) {
    role = 'cashier';
  }
  if (!username || username.length < 3) {
    const url = new URL('/users', req.url);
    url.searchParams.set('error', 'invalid-username');
    return NextResponse.redirect(url);
  }
  if (password.length < 8) {
    const url = new URL('/users', req.url);
    url.searchParams.set('error', 'weak-password');
    return NextResponse.redirect(url);
  }

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .limit(1);
  if (existing.length) {
    const url = new URL('/users', req.url);
    url.searchParams.set('error', 'exists');
    return NextResponse.redirect(url);
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  await db.insert(schema.users).values({ username, passwordHash, role });

  const url = new URL('/users', req.url);
  url.searchParams.set('success', username);
  url.searchParams.set('role', role);
  return NextResponse.redirect(url);
}
