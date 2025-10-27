import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import { ironSession } from 'iron-session/express';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export function createSessionMiddleware(app) {
  const isProduction = process.env.NODE_ENV === 'production';
  const sessionSecret = process.env.SESSION_SECRET;
  if (isProduction && !sessionSecret) {
    throw new Error('SESSION_SECRET environment variable must be set in production.');
  }
  if (!sessionSecret) {
    console.warn('SESSION_SECRET is not set. Using an insecure default secret for development.');
  }
  if (isProduction) app.set('trust proxy', 1);

  return ironSession({
    password: sessionSecret || 'dev-session-secret',
    cookieName: 'pos_sess',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 60 * 60 * 8, // 8 jam (detik)
    },
  });
}
