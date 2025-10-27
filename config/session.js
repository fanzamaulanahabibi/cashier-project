import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export function createSessionMiddleware(app) {
  const isProduction = process.env.NODE_ENV === 'production';
  const PgStore = connectPgSimple(session);

  const sessionSecret = process.env.SESSION_SECRET;
  if (isProduction && !sessionSecret) {
    throw new Error('SESSION_SECRET environment variable must be set in production.');
  }
  if (!sessionSecret) {
    console.warn('SESSION_SECRET is not set. Using an insecure default secret for development.');
  }

  if (isProduction) {
    app.set('trust proxy', 1);
  }

  return session({
    secret: sessionSecret || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    store: new PgStore({
      conString: process.env.DATABASE_URL || process.env.DATABASEURL,
      tableName: 'user_sessions',
      createTableIfMissing: true,
      ssl: { rejectUnauthorized: false },
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 8,
    },
  });
}
