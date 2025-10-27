// Force static imports so the bundler includes these packages in this function bundle
import 'cookie-session';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export default function handler(req, res) {
  // If any of the imports above were missing, the function would fail to build or throw on invocation.
  res.status(200).json({
    ok: true,
    iron: true,
    drizzle: typeof drizzle === 'function',
    neon: typeof neon === 'function',
    env: process.env.NODE_ENV || 'development',
  });
}
