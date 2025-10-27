import express from 'express';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { createSessionMiddleware } from './config/session.js';
import { db } from './drizzle/client.js';
import { sql } from 'drizzle-orm';
import { SHOP, STANDARD_CATEGORIES } from './config/shop.js';

import authRoutes from './routes/authRoutes.js';
import posRoutes from './routes/posRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
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

// Debug endpoints (remove after diagnosis)
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
    const ping = await db.execute(sql`select 1 as ok`);
    const took = Date.now() - start;
    res.json({ ok: true, ping: ping?.rows?.[0]?.ok === 1, tookMs: took });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Root redirect
app.get('/', (req, res) => res.redirect('/pos'));

// Routes
app.use(authRoutes);
app.use(posRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(reportRoutes);

// 404 and error handler
app.use(notFound);
app.use(errorHandler);

export default app;
