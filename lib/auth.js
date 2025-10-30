import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE = 'session';

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || 'dev-session-secret';
  return new TextEncoder().encode(secret);
}

export async function createSession(user) {
  const token = await new SignJWT({ sub: String(user.id), username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecretKey());
  const secure = process.env.NODE_ENV === 'production';
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export function clearSession() {
  cookies().set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { id: payload.sub, username: payload.username, role: payload.role };
  } catch (_) {
    return null;
  }
}

export async function requireUserOrRedirect(pathname = '/login') {
  const user = await getSessionUser();
  if (!user) {
    try {
      const { redirect } = await import('next/navigation');
      redirect(pathname);
    } catch (_) {
      return { redirect: pathname };
    }
  }
  return { user };
}
