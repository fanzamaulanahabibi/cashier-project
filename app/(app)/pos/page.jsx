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
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category || '',
      price: p.price,
      stock: p.stock,
      code: p.sku || '',
    })),
    categories,
  };

  const posTemplate = String.raw`
    <div x-data="posApp()" x-init="init()" x-cloak class="pos-layout animate-fade-in">
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
          <div class="scan-panel mt-4 space-y-2">
            <label class="text-xs uppercase tracking-wider text-subtle font-semibold">Barcode / SKU</label>
            <div class="flex flex-col gap-2 sm:flex-row">
              <input x-model="scanCode" @keydown.enter.prevent="addByCode" placeholder="Masukkan atau scan kode" class="glass-input w-full px-3 py-2" />
              <div class="flex gap-2">
                <button type="button" class="glass-button px-3 py-2 text-sm font-semibold" @click="addByCode">Tambah</button>
                <button type="button" class="glass-button alt px-3 py-2 text-sm font-semibold" @click="openScanner">Scan Kamera</button>
              </div>
            </div>
            <p class="text-xs" :class="scanMessage.includes('berhasil') ? 'text-emerald-600' : 'text-muted'" x-text="scanMessage"></p>
            <div class="flex items-center gap-3 text-xs text-muted pt-1">
              <span class="font-semibold text-subtle">Ukuran fokus</span>
              <input type="range" min="40" max="90" step="5" x-model.number="focusSize" class="flex-1 accent-brand" />
              <span x-text="focusSize + '%'"></span>
            </div>
          </div>
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
      <template x-if="scanner.open">
        <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="closeScanner">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-wider text-subtle font-semibold">Mode Kamera</p>
                <h3 class="text-lg font-semibold text-strong">Scan Barcode Produk</h3>
              </div>
              <button type="button" class="glass-button px-3 py-1 text-sm" @click="closeScanner">Tutup</button>
            </div>
            <div class="rounded-xl overflow-hidden bg-black relative">
              <video x-ref="scanVideo" class="w-full aspect-video" autoplay playsinline muted></video>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="border-4 border-brand/80 rounded-3xl animate-pulse" :style="focusBoxStyle"></div>
              </div>
              <div class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 text-white text-sm" x-show="!scannerReady">
                <svg class="w-8 h-8 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Menyiapkan kamera...</span>
              </div>
              <canvas x-ref="scanCanvas" class="hidden"></canvas>
            </div>
            <p class="text-sm text-muted">Arahkan kamera ke barcode. Setelah kode terbaca, produk akan otomatis ditambahkan ke keranjang, atau gunakan tombol tangkap untuk mencoba dari foto.</p>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm" :class="cameraStatusVariant" x-text="cameraStatus || 'Fokuskan barcode di tengah kotak sebelum menekan tombol.'"></p>
              <button type="button" class="glass-button px-4 py-2 text-sm font-semibold" @click.prevent="captureFrame">Tangkap &amp; Scan</button>
            </div>
          </div>
        </div>
      </template>
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
            scanCode: '',
            scanMessage: '',
            scannerSupported: false,
            scannerReady: false,
            scanner: { open: false, detector: null, stream: null, raf: null, controls: null, zxing: null },
            focusSize: 66,
            cameraStatus: '',
            zxingLoading: null,
            init() {
              this.scannerSupported = typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
            },
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
            get focusBoxStyle() {
              const size = Math.min(95, Math.max(40, this.focusSize || 60));
              const heightPercent = Math.min(80, Math.max(25, size * 0.55));
              return {
                width: size + '%',
                height: heightPercent + '%',
                maxWidth: '400px',
                minWidth: '160px',
                minHeight: '100px',
              };
            },
            get cameraStatusVariant() {
              if (!this.cameraStatus) return 'text-muted';
              if (/berhasil/i.test(this.cameraStatus)) return 'text-emerald-600';
              return 'text-warning-600 text-amber-600';
            },
            findProductByCode(value) {
              const raw = String(value ?? '').trim();
              if (!raw) return null;
              const normalized = raw.replace(/\s+/g, '').toLowerCase();
              const normalizedNoLeadingZero = normalized.replace(/^0+/, '') || normalized;
              const matches = (candidate) => {
                if (!candidate) return false;
                const clean = String(candidate).trim().replace(/\s+/g, '').toLowerCase();
                if (!clean) return false;
                if (clean === normalized) return true;
                const cleanNoZero = clean.replace(/^0+/, '') || clean;
                return cleanNoZero === normalizedNoLeadingZero;
              };
              return (
                this.products.find((p) => matches(p.code) || matches(p.id)) || null
              );
            },
            addByCode() {
              const product = this.findProductByCode(this.scanCode);
              if (product) {
                this.add(product);
                this.scanMessage = 'Produk ditambahkan dari kode.';
                this.scanCode = '';
              } else {
                this.scanMessage = this.scanCode ? 'Kode tidak ditemukan.' : 'Isi kode terlebih dahulu.';
              }
            },
            async openScanner() {
              if (!this.scannerSupported) {
                this.scanMessage = 'Perangkat tidak mendukung akses kamera.';
                return;
              }
              this.scannerReady = false;
            this.scanMessage = 'Mengaktifkan kamera...';
            this.cameraStatus = 'Mengaktifkan kamera...';
              const hasNativeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
              if (hasNativeDetector) {
                if (!this.scanner.detector) {
                  try {
                    this.scanner.detector = new window.BarcodeDetector({ formats: ['code_128', 'code_39', 'ean_13', 'ean_8', 'qr_code', 'upc_a', 'upc_e'] });
                  } catch (error) {
                    this.scanMessage = 'Browser belum mendukung BarcodeDetector.';
                    return;
                  }
                }
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                  this.scanner.stream = stream;
                  this.scanner.open = true;
                  this.$nextTick(() => {
                    const video = this.$refs.scanVideo;
                    if (!video) return;
                    video.srcObject = stream;
                    video.play().catch(() => {});
                    this.scanMessage = 'Kamera aktif, memindai kode...';
                    this.cameraStatus = 'Kamera aktif, arahkan ke barcode.';
                    this.markScannerReady(video);
                    this.scanLoop();
                  });
                } catch (error) {
                  const msg = error.name === 'NotAllowedError' ? 'Izin kamera ditolak.' : 'Kamera gagal diaktifkan.';
                  this.scanMessage = msg;
                  this.cameraStatus = msg;
                }
              } else {
                try {
                  await this.ensureZXingLibrary();
                } catch (error) {
                  this.scanMessage = error.message || 'Pemindai tidak tersedia.';
                  this.cameraStatus = this.scanMessage;
                  return;
                }
                this.scanner.open = true;
                this.$nextTick(() => {
                  const video = this.$refs.scanVideo;
                  if (!video) return;
                  if (!this.scanner.zxing && window.ZXing?.BrowserMultiFormatReader) {
                    this.scanner.zxing = new window.ZXing.BrowserMultiFormatReader();
                  }
                  if (!this.scanner.zxing) {
                    this.scanMessage = 'Pemindai ZXing tidak tersedia.';
                    return;
                  }
                  this.markScannerReady(video);
                  this.scanMessage = 'Kamera aktif, memindai kode...';
                  this.cameraStatus = 'Kamera aktif, arahkan ke barcode.';
                  this.scanner.zxing.decodeFromVideoDevice(null, video, (result, err, controls) => {
                    if (!this.scanner.open) return;
                    if (controls && !this.scanner.controls) this.scanner.controls = controls;
                    if (result) {
                      const value = typeof result.getText === 'function' ? result.getText() : result.text || '';
                      if (value) this.handleDetectedCode(value);
                    } else if (err && err.name === 'NotAllowedError') {
                      this.scanMessage = 'Izin kamera ditolak.';
                      this.cameraStatus = this.scanMessage;
                      this.closeScanner();
                    }
                  }).then((controls) => {
                    this.scanner.controls = controls;
                  }).catch(() => {
                    this.scanMessage = 'Gagal mengaktifkan kamera.';
                    this.cameraStatus = this.scanMessage;
                    this.closeScanner();
                  });
                });
              }
            },
            closeScanner() {
              if (this.scanner.raf) {
                cancelAnimationFrame(this.scanner.raf);
                this.scanner.raf = null;
              }
              if (this.scanner.stream) {
                this.scanner.stream.getTracks().forEach((track) => track.stop());
                this.scanner.stream = null;
              }
              if (this.scanner.controls) {
                this.scanner.controls.stop();
                this.scanner.controls = null;
              }
              if (this.scanner.zxing) {
                this.scanner.zxing.reset();
              }
              this.scanner.open = false;
              this.scannerReady = false;
              this.cameraStatus = '';
            },
            scanLoop() {
              if (!this.scanner.open) return;
              if (!this.scanner.detector) return;
              const video = this.$refs.scanVideo;
              if (!video) return;
              const detect = () => {
                if (!this.scanner.open) return;
                if (!video.readyState || video.readyState < 2) {
                   this.scanner.raf = requestAnimationFrame(detect);
                   return;
                 }
                this.scanner.detector.detect(video).then((codes) => {
                  if (!this.scanner.open) return;
                  const value = (codes && codes[0] && codes[0].rawValue) ? codes[0].rawValue.trim() : '';
                  if (value) {
                    this.handleDetectedCode(value);
                  } else {
                    this.scanner.raf = requestAnimationFrame(detect);
                  }
                }).catch(() => {
                  this.scanner.raf = requestAnimationFrame(detect);
                });
              };
              this.scanner.raf = requestAnimationFrame(detect);
            },
            markScannerReady(video) {
              if (!video) return;
              if (video.readyState >= 2) {
                this.scannerReady = true;
                return;
              }
              const handler = () => {
                this.scannerReady = true;
                video.removeEventListener('loadeddata', handler);
                video.removeEventListener('canplay', handler);
              };
              video.addEventListener('loadeddata', handler, { once: true });
              video.addEventListener('canplay', handler, { once: true });
            },
            ensureZXingLibrary() {
              if (window.ZXing?.BrowserMultiFormatReader) {
                return Promise.resolve();
              }
              if (!this.zxingLoading) {
                this.zxingLoading = new Promise((resolve, reject) => {
                  const script = document.createElement('script');
                  script.src = 'https://unpkg.com/@zxing/library@0.20.0/umd/index.min.js';
                  script.async = true;
                  script.onload = () => resolve();
                  script.onerror = () => reject(new Error('Gagal memuat modul pemindai.'));
                  document.head.appendChild(script);
                });
              }
              return this.zxingLoading;
            },
            handleDetectedCode(value) {
              this.scanCode = value;
              this.scanMessage = 'Kode terdeteksi: ' + value;
              this.addByCode();
              this.closeScanner();
            },
            async captureFrame() {
              const video = this.$refs.scanVideo;
              const canvas = this.$refs.scanCanvas;
              if (!video || !canvas) {
                this.scanMessage = 'Kamera belum siap.';
                this.cameraStatus = 'Kamera belum siap untuk ditangkap.';
                return;
              }
              const width = video.videoWidth || 640;
              const height = video.videoHeight || 360;
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0, width, height);
              this.scanMessage = 'Memindai dari foto...';
               this.cameraStatus = 'Memindai dari foto...';
              if (this.scanner.detector) {
                try {
                  const codes = await this.scanner.detector.detect(canvas);
                  const value = codes && codes[0] && codes[0].rawValue ? codes[0].rawValue.trim() : '';
                  if (value) {
                    this.handleDetectedCode(value);
                  } else {
                    this.scanMessage = 'Kode tidak ditemukan pada foto.';
                    this.cameraStatus = 'Kode tidak ditemukan pada foto.';
                  }
                } catch (error) {
                  this.scanMessage = 'Foto gagal dipindai.';
                  this.cameraStatus = 'Foto gagal dipindai.';
                }
              } else {
                try {
                  await this.ensureZXingLibrary();
                  if (!window.ZXing?.BrowserMultiFormatReader) throw new Error('Modul ZXing tidak tersedia.');
                  const dataUrl = canvas.toDataURL('image/png');
                  const reader = new window.ZXing.BrowserMultiFormatReader();
                  reader
                    .decodeFromImage(undefined, dataUrl)
                    .then((result) => {
                      const text = typeof result.getText === 'function' ? result.getText() : result.text || '';
                      if (text) {
                        this.handleDetectedCode(text);
                      } else {
                        this.scanMessage = 'Kode tidak ditemukan pada foto.';
                        this.cameraStatus = 'Kode tidak ditemukan pada foto.';
                      }
                    })
                    .catch(() => {
                      this.scanMessage = 'Kode tidak ditemukan pada foto.';
                      this.cameraStatus = 'Kode tidak ditemukan pada foto.';
                    })
                    .finally(() => reader.reset());
                } catch (error) {
                  this.scanMessage = error.message || 'Pemindaian foto gagal.';
                  this.cameraStatus = this.scanMessage;
                }
              }
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
