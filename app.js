import express from 'express';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { createSessionMiddleware } from './config/session.js';
import { SHOP, STANDARD_CATEGORIES } from './config/shop.js';

// Routes will be lazy-mounted on first request to avoid heavy cold-start imports
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Simple health endpoint for uptime checks (placed before session middleware)
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'coffee-pos',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Ultra-early ping to ensure Express handler responds even before any heavy imports
app.get('/__ping', (_req, res) => {
  res.type('text').send('ok');
});

app.use(createSessionMiddleware(app));

// Expose helpers to templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
  res.locals.dayjs = dayjs;
  res.locals.SHOP = SHOP;
  res.locals.STANDARD_CATEGORIES = STANDARD_CATEGORIES;
  next();
});

// Minimal fallback routes so first request doesn't 404 while routes are being mounted
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login', { error: null }));

// Debug endpoints (remove after diagnosis)
// Move debug endpoints before session to isolate middleware issues
app.get('/debug-session', (req, res) => {
  res.json({
    ok: true,
    hasSession: !!req.session,
    keys: Object.keys(req.session || {}),
    user: req.session?.user || null,
  });
});

app.get('/debug-db', async (req, res) => {
  const start = Date.now();
  try {
    const { db } = await import('./drizzle/client.js');
    const { sql } = await import('drizzle-orm');
    const ping = await db.execute(sql`select 1 as ok`);
    const took = Date.now() - start;
    res.json({ ok: true, ping: ping?.rows?.[0]?.ok === 1, tookMs: took });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Lazy‑mount routes on first request, then continue
let routesMounted = false;
export async function ensureRoutes() {
  if (routesMounted) return;
  const [{ default: authRoutes }, { default: posRoutes }, { default: productRoutes }, { default: orderRoutes }, { default: reportRoutes }] = await Promise.all([
    import('./routes/authRoutes.js'),
    import('./routes/posRoutes.js'),
    import('./routes/productRoutes.js'),
    import('./routes/orderRoutes.js'),
    import('./routes/reportRoutes.js'),
  ]);
  app.get('/', (req, res) => res.redirect('/pos'));
  app.use(authRoutes);
  app.use(posRoutes);
  app.use(productRoutes);
  app.use(orderRoutes);
  app.use(reportRoutes);
  // Now attach 404 and error handlers at the end
  app.use(notFound);
  app.use(errorHandler);
  routesMounted = true;
}

export default app;
