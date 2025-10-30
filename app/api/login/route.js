import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, schema } from '../../../lib/db.js';
import { eq } from 'drizzle-orm';
import { createSession } from '../../../lib/auth.js';

export async function POST(req) {
  const form = await req.formData();
  const username = String(form.get('username') || '').trim();
  const password = String(form.get('password') || '');
  try {
    const rows = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    const user = rows[0];
    if (!user) return NextResponse.redirect(new URL('/login?error=1', req.url));
    if (!bcrypt.compareSync(password, user.passwordHash)) return NextResponse.redirect(new URL('/login?error=1', req.url));
    await createSession({ id: user.id, username: user.username, role: user.role });
    return NextResponse.redirect(new URL('/pos', req.url));
  } catch (e) {
    return NextResponse.redirect(new URL('/login?error=1', req.url));
  }
}

