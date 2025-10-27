import { db, schema } from '../drizzle/client.js';
import { eq, sql } from 'drizzle-orm';

function normalizeProductPayload(formBody = {}) {
  const name = (formBody.name || '').trim();
  if (!name) throw new Error('Nama produk wajib diisi.');
  const rawPrice = formBody.price;
  const price = Number.parseInt(rawPrice, 10);
  if (Number.isNaN(price) || price <= 0) throw new Error('Harga tidak valid.');
  let stock = 0;
  if (!(formBody.stock === undefined || formBody.stock === null || formBody.stock === '')) {
    stock = Number.parseInt(formBody.stock, 10);
    if (Number.isNaN(stock) || stock < 0) throw new Error('Stok tidak valid.');
  }
  const category = (formBody.category || '').trim() || null;
  const sku = (formBody.sku || '').trim() || null;
  const isActive = formBody.is_active === true
    || formBody.is_active === 'true'
    || formBody.is_active === 'on'
    || formBody.is_active === '1'
    || formBody.is_active === 1;
  return { name, sku, price, category, stock, is_active: isActive ? 1 : 0 };
}

export async function pageList(req, res) {
  const rows = await db.select().from(schema.products).orderBy(sql`is_active DESC`, schema.products.name);
  res.render('products', { rows });
}

export async function create(req, res) {
  try {
    const payload = normalizeProductPayload(req.body);
    await db.insert(schema.products).values({
      name: payload.name,
      sku: payload.sku,
      price: payload.price,
      category: payload.category,
      stock: payload.stock,
      isActive: payload.is_active === 1,
    });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message || 'Gagal membuat produk');
  }
}

export async function update(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).send('ID produk tidak valid.');
  try {
    const payload = normalizeProductPayload(req.body);
    await db.update(schema.products)
      .set({ name: payload.name, sku: payload.sku, price: payload.price, category: payload.category, stock: payload.stock, isActive: payload.is_active === 1 })
      .where(eq(schema.products.id, id));
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message || 'Gagal memperbarui produk');
  }
}

export async function remove(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).send('ID produk tidak valid.');
  try {
    await db.update(schema.orderItems).set({ productId: null }).where(eq(schema.orderItems.productId, id));
    await db.delete(schema.products).where(eq(schema.products.id, id));
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(400).send('Gagal menghapus produk');
  }
}

export async function apiCreate(req, res) {
  try {
    const { name, sku, price, category, stock } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Nama dan harga harus diisi' });
    const p = parseInt(price, 10);
    if (Number.isNaN(p) || p <= 0) return res.status(400).json({ error: 'Harga tidak valid' });
    const s = stock === '' || stock === undefined ? 0 : parseInt(stock, 10);
    const inserted = await db.insert(schema.products).values({ name, sku: sku || null, price: p, category: category || null, stock: Number.isNaN(s) ? 0 : s, isActive: true }).returning();
    res.json({ product: inserted[0] });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
}

export async function apiDelete(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID tidak valid' });
    await db.update(schema.orderItems).set({ productId: null }).where(eq(schema.orderItems.productId, id));
    const resDel = await db.delete(schema.products).where(eq(schema.products.id, id));
    // drizzle delete returns affected row count in resDel.rowCount via driver
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
}
