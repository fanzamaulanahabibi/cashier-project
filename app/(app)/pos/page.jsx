import { requireUserOrRedirect } from '../../../lib/auth.js';
import { db, schema } from '../../../lib/db.js';
import { eq, sql } from 'drizzle-orm';
import { STANDARD_CATEGORIES } from '../../../config/shop.js';

export const dynamic = 'force-dynamic';

export default async function PosPage() {
  const { user, redirect } = await requireUserOrRedirect();
  if (redirect) return null;

  const categoryRows = await db.execute(sql`SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category`);
  const dataCategories = categoryRows.rows.map((r) => r.category).filter((name) => name && name.trim() !== '');
  const products = await db.select().from(schema.products).where(eq(schema.products.isActive, true)).orderBy(schema.products.name);
  const categories = [...STANDARD_CATEGORIES];
  for (const name of dataCategories) if (!categories.includes(name)) categories.push(name);

  const payload = {
    products: products.map((p) => ({ id: p.id, name: p.name, category: p.category || '', price: p.price, stock: p.stock })),
    categories,
  };

  const posTemplate = String.raw`
    <div x-data="posApp()" x-cloak class="pos-layout animate-fade-in">
      <div class="pos-products-shell">
        <section class="pos-search-card">
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-brandDeep/70">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"/></svg>
            </span>
            <input x-model="search" placeholder="Cari produk atau kategori..." class="glass-input w-full pl-11 pr-4 py-3 text-base placeholder:text-subtle" />
          </div>
          <template x-if="categories.length">
            <div class="pos-category-list">
              <button type="button" class="chip-option" :class="activeCategory === '' ? 'active' : ''" @click="setCategory('')">Semua</button>
              <template x-for="cat in categories" :key="cat">
                <button type="button" class="chip-option" :class="activeCategory === cat ? 'active' : ''" x-text="cat" @click="setCategory(cat)"></button>
              </template>
            </div>
          </template>
        </section>
        <section class="section-card">
          <template x-if="filteredProducts().length">
            <div class="pos-product-grid">
              <template x-for="product in filteredProducts()" :key="product.id">
                <div class="pos-product-card" data-product-card @click="add(product)">
                  <span class="pos-chip" x-text="product.category || 'Umum'"></span>
                  <div class="pos-product-title" x-text="product.name"></div>
                  <div class="pos-product-meta">Stok: <span x-text="product.stock ?? 0"></span></div>
                  <div class="pos-product-price" x-text="window.formatIDR(product.price)"></div>
                  <span class="pos-add-indicator">+</span>
                </div>
              </template>
            </div>
          </template>
          <template x-if="!filteredProducts().length">
            <div class="pos-cart-empty">Tidak ditemukan produk yang cocok.</div>
          </template>
        </section>
      </div>
      <aside class="pos-cart-card">
        <div class="pos-cart-header">
          <p x-text="cartSummary()"></p>
          <button type="button" class="text-xs text-subtle hover:text-strong" @click="clearCart()">Bersihkan</button>
        </div>
        <template x-if="items.length">
          <div class="pos-cart-items">
            <template x-for="(item, i) in items" :key="item.id">
              <div class="pos-cart-item">
                <div>
                  <strong x-text="item.name"></strong>
                  <div class="pos-product-meta" x-text="window.formatIDR(item.price)"></div>
                </div>
                <div class="flex items-center gap-2">
                  <input type="number" min="1" class="glass-input w-20 px-2 py-1 text-sm" x-model.number="item.qty" @change="recalc()" />
                  <button type="button" class="text-xs text-subtle hover:text-strong" @click="remove(i)">Hapus</button>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template x-if="!items.length">
          <div class="pos-cart-empty">Belum ada item di keranjang</div>
        </template>
        <div class="pos-summary-row">
          <span>Total</span>
          <span class="pos-summary-total" x-text="window.formatIDR(total())"></span>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wider text-subtle font-semibold mb-2">Metode Pembayaran</p>
          <div class="pos-payment-options">
            <label class="chip-option" :class="payment_method === 'cash' ? 'active' : ''">
              <input type="radio" value="cash" x-model="payment_method" class="sr-only" />
              <span>Cash</span>
            </label>
            <label class="chip-option" :class="payment_method === 'qris' ? 'active' : ''">
              <input type="radio" value="qris" x-model="payment_method" class="sr-only" />
              <span>QRIS</span>
            </label>
            <label class="chip-option" :class="payment_method === 'card' ? 'active' : ''">
              <input type="radio" value="card" x-model="payment_method" class="sr-only" />
              <span>Kartu</span>
            </label>
          </div>
        </div>
        <template x-if="payment_method === 'cash'">
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-wider text-subtle font-semibold">Uang Diterima</label>
            <input x-model.number="cash_received" type="number" min="0" class="glass-input w-full px-3 py-2" />
            <div class="pos-summary-row text-xs">
              <span>Kembalian</span>
              <strong class="text-strong" x-text="window.formatIDR(change())"></strong>
            </div>
          </div>
        </template>
        <template x-if="message">
          <div class="form-feedback" :class="message.includes('berhasil') ? 'success' : 'error'" x-text="message"></div>
        </template>
        <div class="pos-actions">
          <button type="button" class="glass-button px-4 py-3 font-semibold" :disabled="!items.length" @click="checkout(false)">Bayar</button>
          <button type="button" class="glass-button alt px-4 py-3 font-semibold" :disabled="!items.length" @click="checkout(true)">Bayar & Cetak</button>
        </div>
      </aside>
    </div>
  `;

  return (
    <>
      <script id="pos-data" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
      <script dangerouslySetInnerHTML={{ __html: `
        (function () {
          try {
            const raw = document.getElementById('pos-data')?.textContent || '{}';
            window.__POS_DATA__ = JSON.parse(raw);
          } catch (e) {
            window.__POS_DATA__ = { products: [], categories: [] };
          }
        })();
      ` }} />
      <div className="flex flex-col gap-8 text-base">
        <div className="space-y-3 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/15 text-brand text-sm font-medium shadow-soft w-max" style={{ border: '1px solid rgba(15,118,110,0.25)' }}>Dashboard Kasir</span>
          <h1 className="text-3xl lg:text-4xl font-semibold text-strong">Kasir Warung Agen Sembako</h1>
          <p className="text-sm text-muted">Atur transaksi, kelola stok, dan selesaikan pembayaran pelanggan dengan antarmuka yang bersih dan ramah.</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: posTemplate }} />
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
        function posApp() {
          const globalData = window.__POS_DATA__ || {};
          return {
            search: '',
            activeCategory: '',
            products: Array.isArray(globalData.products) ? globalData.products : [],
            categories: Array.isArray(globalData.categories) ? globalData.categories : [],
            items: [],
            payment_method: 'cash',
            cash_received: 0,
            message: '',
            filteredProducts() {
              const keyword = (this.search || '').trim().toLowerCase();
              const category = (this.activeCategory || '').toLowerCase();
              return this.products.filter((p) => {
                const name = (p.name || '').toLowerCase();
                const cat = (p.category || '').toLowerCase();
                const matchKeyword = !keyword || name.includes(keyword) || cat.includes(keyword);
                const matchCategory = !category || cat === category;
                return matchKeyword && matchCategory;
              });
            },
            cartSummary() {
              if (!this.items.length) return 'Belum ada item di keranjang';
              const totalQty = this.items.reduce((sum, item) => sum + item.qty, 0);
              return this.items.length + ' produk - ' + totalQty + ' item';
            },
            setCategory(value) {
              this.activeCategory = value || '';
            },
            add(product) {
              const idx = this.items.findIndex((item) => item.id === product.id);
              if (idx >= 0) {
                this.items[idx].qty += 1;
              } else {
                this.items.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
              }
              this.recalc();
              this.message = '';
            },
            remove(index) {
              this.items.splice(index, 1);
              this.recalc();
            },
            clearCart() {
              this.items = [];
              this.cash_received = 0;
              this.message = '';
            },
            total() {
              return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
            },
            change() {
              return Math.max(0, (this.cash_received || 0) - this.total());
            },
            recalc() {
              this.items = this.items.map((item) => ({ ...item, qty: Math.max(1, parseInt(item.qty || 1, 10) || 1) }));
            },
            async checkout(autoPrint) {
              if (this.items.length === 0) {
                this.message = 'Keranjang kosong';
                return;
              }
              try {
                const res = await fetch('/pos/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    items: this.items.map((i) => ({ product_id: i.id, qty: i.qty })),
                    payment_method: this.payment_method,
                    cash_received: this.payment_method === 'cash' ? this.cash_received : 0,
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Gagal checkout');
                this.items = [];
                this.cash_received = 0;
                this.message = 'Transaksi berhasil.';
                if (autoPrint && data.redirectUrl) {
                  window.location.href = data.redirectUrl;
                } else {
                  window.location.href = '/orders';
                }
              } catch (error) {
                this.message = error.message;
              }
            },
          };
        }
      ` }} />
    </>
  );
}
