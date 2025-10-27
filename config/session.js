import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import { ironSession } from 'iron-session/express';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export function createSessionMiddleware(app) {
  const isProduction = process.env.NODE_ENV === 'production';
  const sessionSecret = process.env.SESSION_SECRET;
  const secret = (sessionSecret || '').trim();
  const disable = (process.env.DISABLE_SESSION || '').trim();
  const disableSession = disable === '1' || disable.toLowerCase() === 'true';

  if (disableSession) {
    // Fallback no-op session for diagnostics only
    console.warn('Session middleware disabled via DISABLE_SESSION. Do not use in production.');
    return (req, _res, next) => {
      if (!req.session) req.session = {};
      // minimal shims for existing code paths
      req.session.destroy = (cb) => { try { if (cb) cb(); } catch (_) {} };
      req.session.save = async () => {};
      next();
    };
  }
  if (isProduction && !secret) {
    throw new Error('SESSION_SECRET environment variable must be set in production.');
  }
  if (!secret) {
    console.warn('SESSION_SECRET is not set. Using an insecure default secret for development.');
  }
  if (isProduction) app.set('trust proxy', 1);

  return ironSession({
    password: secret || 'dev-session-secret',
    cookieName: 'pos_sess',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 60 * 60 * 8, // 8 jam (detik)
    },
  });
}
