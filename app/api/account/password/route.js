import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, schema } from '../../../../lib/db.js';
import { getSessionUser } from '../../../../lib/auth.js';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const form = await req.formData();
  const currentPassword = String(form.get('currentPassword') || '');
  const newPassword = String(form.get('newPassword') || '');
  const confirmPassword = String(form.get('confirmPassword') || '');

  const redirectUrl = new URL('/account/password', req.url);

  if (newPassword.length < 8) {
    redirectUrl.searchParams.set('error', 'weak-password');
    return NextResponse.redirect(redirectUrl);
  }
  if (newPassword !== confirmPassword) {
    redirectUrl.searchParams.set('error', 'mismatch');
    return NextResponse.redirect(redirectUrl);
  }

  const rows = await db.select().from(schema.users).where(eq(schema.users.id, Number(sessionUser.id))).limit(1);
  const user = rows[0];
  if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
    redirectUrl.searchParams.set('error', 'invalid-current');
    return NextResponse.redirect(redirectUrl);
  }

  const newHash = bcrypt.hashSync(newPassword, 12);
  await db.update(schema.users).set({ passwordHash: newHash }).where(eq(schema.users.id, user.id));

  redirectUrl.searchParams.set('status', 'success');
  return NextResponse.redirect(redirectUrl);
}

