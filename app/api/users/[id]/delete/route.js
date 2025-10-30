import { NextResponse } from 'next/server';
import { db, schema } from '../../../../../lib/db.js';
import { getSessionUser } from '../../../../../lib/auth.js';
import { eq } from 'drizzle-orm';

export async function POST(req, { params }) {
  const currentUser = await getSessionUser();
  if (!currentUser) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (currentUser.role !== 'admin') {
    const redirectUrl = new URL('/users', req.url);
    redirectUrl.searchParams.set('error', 'forbidden');
    return NextResponse.redirect(redirectUrl);
  }

  const targetId = Number(params.id);
  if (!Number.isInteger(targetId) || targetId <= 0) {
    const redirectUrl = new URL('/users', req.url);
    redirectUrl.searchParams.set('error', 'not-found');
    return NextResponse.redirect(redirectUrl);
  }

  if (String(currentUser.id) === String(targetId)) {
    const redirectUrl = new URL('/users', req.url);
    redirectUrl.searchParams.set('error', 'self-delete');
    return NextResponse.redirect(redirectUrl);
  }

  const target = await db
    .select({
      id: schema.users.id,
      username: schema.users.username,
    })
    .from(schema.users)
    .where(eq(schema.users.id, targetId))
    .limit(1);
  const userRecord = target[0];
  if (!userRecord) {
    const redirectUrl = new URL('/users', req.url);
    redirectUrl.searchParams.set('error', 'not-found');
    return NextResponse.redirect(redirectUrl);
  }

  await db.delete(schema.users).where(eq(schema.users.id, targetId));

  const redirectUrl = new URL('/users', req.url);
  redirectUrl.searchParams.set('removed', userRecord.username);
  return NextResponse.redirect(redirectUrl);
}
