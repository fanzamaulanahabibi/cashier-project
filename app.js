import express from 'express';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { createSessionMiddleware } from './config/session.js';
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
