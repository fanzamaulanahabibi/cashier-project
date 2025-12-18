(()=>{var e={};e.id=760,e.ids=[760],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1568:e=>{"use strict";e.exports=require("zlib")},2254:e=>{"use strict";e.exports=require("node:buffer")},6005:e=>{"use strict";e.exports=require("node:crypto")},7261:e=>{"use strict";e.exports=require("node:util")},8359:()=>{},948:()=>{},5483:(e,t,a)=>{"use strict";a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{GlobalError:()=>c.a,__next_app__:()=>g,originalPathname:()=>h,pages:()=>m,routeModule:()=>x,tree:()=>p});var r=a(2206);a(27),a(5866),a(899);var n=a(3191),i=a(8716),o=a(7922),c=a.n(o),d=a(5231),l={};for(let e in d)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>d[e]);a.d(t,l);var u=e([r]);r=(u.then?(await u)():u)[0];let p=["",{children:["(app)",{children:["pos",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,2206)),"C:\\coffee-pos\\app\\(app)\\pos\\page.jsx"]}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,27)),"C:\\coffee-pos\\app\\(app)\\layout.js"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}]},{layout:[()=>Promise.resolve().then(a.bind(a,899)),"C:\\coffee-pos\\app\\layout.js"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}],m=["C:\\coffee-pos\\app\\(app)\\pos\\page.jsx"],h="/(app)/pos/page",g={require:a,loadChunk:()=>Promise.resolve()},x=new n.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/(app)/pos/page",pathname:"/pos",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:p}});s()}catch(e){s(e)}})},7706:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,2994,23)),Promise.resolve().then(a.t.bind(a,6114,23)),Promise.resolve().then(a.t.bind(a,9727,23)),Promise.resolve().then(a.t.bind(a,9671,23)),Promise.resolve().then(a.t.bind(a,1868,23)),Promise.resolve().then(a.t.bind(a,4759,23))},3970:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,4064,23))},2621:()=>{},5303:()=>{},2206:(e,t,a)=>{"use strict";a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{default:()=>u,dynamic:()=>p});var r=a(9510),n=a(8855),i=a(53),o=a(4149),c=a(7745),d=a(8035),l=e([i]);i=(l.then?(await l)():l)[0];let p="force-dynamic";async function u(){let{user:e,redirect:t}=await (0,n.O)();if(t)return null;let a=(await i.db.execute((0,o.i6)`SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category`)).rows.map(e=>e.category).filter(e=>e&&""!==e.trim()),s=await i.db.select().from(i.f.products).where((0,c.eq)(i.f.products.isActive,!0)).orderBy(i.f.products.name),l=[...d.i];for(let e of a)l.includes(e)||l.push(e);let u={products:s.map(e=>({id:e.id,name:e.name,category:e.category||"",price:e.price,stock:e.stock,code:e.sku||""})),categories:l},p=String.raw`
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
            <div class="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p class="text-xs uppercase tracking-wider text-subtle font-semibold">Mode Kamera</p>
                <h3 class="text-lg font-semibold text-strong">Scan Barcode Produk</h3>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" class="glass-button alt px-3 py-1 text-sm" @click="toggleCameraFacing" x-text="cameraToggleLabel"></button>
                <button type="button" class="glass-button px-3 py-1 text-sm" @click="closeScanner">Tutup</button>
              </div>
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
  `;return(0,r.jsxs)(r.Fragment,{children:[r.jsx("script",{id:"pos-data",type:"application/json",dangerouslySetInnerHTML:{__html:JSON.stringify(u)}}),r.jsx("script",{dangerouslySetInnerHTML:{__html:`
        (function () {
          try {
            const raw = document.getElementById('pos-data')?.textContent || '{}';
            window.__POS_DATA__ = JSON.parse(raw);
          } catch (e) {
            window.__POS_DATA__ = { products: [], categories: [] };
          }
        })();
      `}}),(0,r.jsxs)("div",{className:"flex flex-col gap-8 text-base",children:[(0,r.jsxs)("div",{className:"space-y-3 animate-fade-in",children:[r.jsx("span",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/15 text-brand text-sm font-medium shadow-soft w-max",style:{border:"1px solid rgba(15,118,110,0.25)"},children:"Dashboard Kasir"}),r.jsx("h1",{className:"text-3xl lg:text-4xl font-semibold text-strong",children:"Kasir Warung Agen Sembako"}),r.jsx("p",{className:"text-sm text-muted",children:"Atur transaksi, kelola stok, dan selesaikan pembayaran pelanggan dengan antarmuka yang bersih dan ramah."})]}),r.jsx("div",{dangerouslySetInnerHTML:{__html:p}})]}),r.jsx("script",{dangerouslySetInnerHTML:{__html:`
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
            cameraFacing: 'environment',
            focusSize: 66,
            cameraStatus: '',
            zxingLoading: null,
            audioCtx: null,
            sync: { pushTimer: null, pollTimer: null, inFlight: false, lastUpdatedAt: null, suppressNextPush: false },
            init() {
              this.scannerSupported = typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
              this.loadCartFromServer();
              this.startCartPolling();
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
            mapServerItems(serverItems) {
              const list = Array.isArray(serverItems) ? serverItems : [];
              const byId = new Map(this.products.map((p) => [p.id, p]));
              const mapped = [];
              for (const raw of list) {
                const productId = parseInt(raw?.product_id ?? raw?.id, 10);
                const qty = Math.max(1, parseInt(raw?.qty ?? 0, 10) || 1);
                const p = byId.get(productId);
                if (p) mapped.push({ id: p.id, name: p.name, price: p.price, qty });
              }
              return mapped;
            },
            queueSync() {
              if (this.sync.pushTimer) clearTimeout(this.sync.pushTimer);
              this.sync.pushTimer = setTimeout(() => this.pushCart(), 450);
            },
            async pushCart() {
              if (this.sync.inFlight) return;
              this.sync.inFlight = true;
              const payload = {
                items: this.items.map((i) => ({ product_id: i.id, qty: i.qty })),
              };
              try {
                const res = await fetch('/api/cart', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                  cache: 'no-store',
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok && data?.updated_at) {
                  this.sync.lastUpdatedAt = data.updated_at;
                }
              } catch (_) {
                // Diamkan; akan coba sinkron berikutnya
              } finally {
                this.sync.inFlight = false;
              }
            },
            async loadCartFromServer(isPolling = false) {
              try {
                const res = await fetch('/api/cart', { cache: 'no-store' });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || 'Gagal memuat keranjang');
                const updatedAt = data?.updated_at || null;
                const shouldApply = !isPolling || (updatedAt && updatedAt !== this.sync.lastUpdatedAt);
                if (shouldApply) {
                  const mapped = this.mapServerItems(data?.items || []);
                  this.sync.suppressNextPush = true;
                  this.items = mapped;
                  this.recalc(true);
                  this.sync.suppressNextPush = false;
                  this.sync.lastUpdatedAt = updatedAt;
                }
              } catch (_) {
                // Abaikan error polling
              }
            },
            startCartPolling() {
              if (this.sync.pollTimer) return;
              this.sync.pollTimer = setInterval(() => this.loadCartFromServer(true), 4000);
            },
            markLocalChange() {
              if (this.sync.suppressNextPush) {
                this.sync.suppressNextPush = false;
                return;
              }
              this.queueSync();
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
              this.markLocalChange();
            },
            total() {
              return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
            },
            change() {
              return Math.max(0, (this.cash_received || 0) - this.total());
            },
            recalc(skipSync = false) {
              this.items = this.items.map((item) => ({ ...item, qty: Math.max(1, parseInt(item.qty || 1, 10) || 1) }));
              if (!skipSync) this.markLocalChange();
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
            get cameraFacingLabel() {
              return this.cameraFacing === 'environment' ? 'Kamera Belakang' : 'Kamera Depan';
            },
            get cameraToggleLabel() {
              return this.cameraFacing === 'environment' ? 'Gunakan Kamera Depan' : 'Gunakan Kamera Belakang';
            },
            findProductByCode(value) {
              const raw = String(value ?? '').trim();
              if (!raw) return null;
              const normalized = raw.replace(/s+/g, '').toLowerCase();
              const normalizedNoLeadingZero = normalized.replace(/^0+/, '') || normalized;
              const matches = (candidate) => {
                if (!candidate) return false;
                const clean = String(candidate).trim().replace(/s+/g, '').toLowerCase();
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
            openScanner() {
              if (!this.scannerSupported) {
                this.scanMessage = 'Perangkat tidak mendukung akses kamera.';
                return;
              }
              if (!this.scanner.open) {
                this.scanner.open = true;
              }
              this.restartScanner();
            },
            toggleCameraFacing() {
              this.cameraFacing = this.cameraFacing === 'environment' ? 'user' : 'environment';
              if (this.scanner.open) {
                this.restartScanner();
              }
            },
            restartScanner() {
              if (!this.scanner.open) return;
              this.cleanupScannerStream();
              this.scannerReady = false;
              this.scanMessage = 'Mengaktifkan kamera...';
              this.cameraStatus = 'Mengaktifkan kamera...';
              this.$nextTick(() => {
                this.startScannerSession();
              });
            },
            async startScannerSession() {
              if (!this.scanner.open) return;
              const video = this.$refs.scanVideo;
              if (!video) return;
              const hasNativeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
              const facingLabel = this.cameraFacingLabel;
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
                  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: this.cameraFacing } });
                  this.scanner.stream = stream;
                  video.srcObject = stream;
                  video.play().catch(() => {});
                  this.scanMessage = facingLabel + ' aktif, memindai kode...';
                  this.cameraStatus = facingLabel + ' siap, arahkan ke barcode.';
                  this.markScannerReady(video);
                  this.scanLoop();
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
                if (!this.scanner.zxing && window.ZXing?.BrowserMultiFormatReader) {
                  this.scanner.zxing = new window.ZXing.BrowserMultiFormatReader();
                }
                if (!this.scanner.zxing) {
                  this.scanMessage = 'Pemindai ZXing tidak tersedia.';
                  return;
                }
                this.markScannerReady(video);
                this.scanMessage = facingLabel + ' aktif, memindai kode...';
                this.cameraStatus = facingLabel + ' siap, arahkan ke barcode.';
                const constraints = { audio: false, video: { facingMode: this.cameraFacing } };
                this.scanner.zxing.decodeFromConstraints(constraints, video, (result, err, controls) => {
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
              }
            },
            cleanupScannerStream() {
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
              const video = this.$refs && this.$refs.scanVideo ? this.$refs.scanVideo : null;
              if (video) {
                if (typeof video.pause === 'function') video.pause();
                video.srcObject = null;
              }
            },
            closeScanner() {
              this.cleanupScannerStream();
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
                if (video.srcObject) this.scanner.stream = video.srcObject;
                return;
              }
              const handler = () => {
                this.scannerReady = true;
                if (video.srcObject) this.scanner.stream = video.srcObject;
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
              this.playScanSound();
              this.addByCode();
              this.closeScanner();
            },
            playScanSound() {
              try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                if (!this.audioCtx) {
                  this.audioCtx = new AudioCtx();
                }
                const ctx = this.audioCtx;
                if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume();
                const oscillator = ctx.createOscillator();
                const gain = ctx.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.value = 880;
                gain.gain.value = 0.15;
                oscillator.connect(gain);
                gain.connect(ctx.destination);
                const now = ctx.currentTime;
                oscillator.start(now);
                oscillator.stop(now + 0.18);
              } catch (error) {
                console.warn('Gagal memutar suara scan', error);
              }
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
                await this.pushCart();
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
      `}})]})}s()}catch(e){s(e)}})},7272:()=>{},27:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>o});var s=a(9510),r=a(9720),n=a(8855),i=a(8035);async function o({children:e}){let t=await (0,n.xn)(),a=t?.role==="admin";return(0,s.jsxs)(s.Fragment,{children:[s.jsx(r.default,{id:"app-utils",strategy:"beforeInteractive",children:"window.formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);"}),s.jsx(r.default,{src:"https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js",strategy:"afterInteractive"}),s.jsx("nav",{className:"navbar",children:(0,s.jsxs)("div",{className:"nav-inner max-w-6xl mx-auto",children:[(0,s.jsxs)("div",{className:"nav-brand flex items-center gap-3",children:[s.jsx("span",{className:"inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand font-semibold shadow-soft",children:"KW"}),(0,s.jsxs)("div",{children:[s.jsx("p",{className:"text-xs uppercase tracking-wider text-subtle",children:"Warung Sembako"}),s.jsx("p",{className:"text-lg font-semibold text-strong",children:i.k.name})]})]}),s.jsx("input",{type:"checkbox",id:"nav-toggle",className:"nav-toggle","aria-controls":"main-menu","aria-label":"Toggle menu"}),(0,s.jsxs)("label",{htmlFor:"nav-toggle",className:"nav-toggle-btn","aria-hidden":"true",children:[s.jsx("span",{}),s.jsx("span",{}),s.jsx("span",{})]}),s.jsx("div",{className:"nav-links flex items-center gap-3 text-sm",id:"main-menu",children:t?(0,s.jsxs)(s.Fragment,{children:[s.jsx("a",{href:"/pos",className:"nav-link",children:"Kasir"}),s.jsx("a",{href:"/orders",className:"nav-link",children:"Riwayat"}),a&&s.jsx("a",{href:"/reports/daily",className:"nav-link",children:"Laporan"}),a&&s.jsx("a",{href:"/products",className:"nav-link",children:"Produk"}),a&&s.jsx("a",{href:"/users",className:"nav-link",children:"Pengguna"}),s.jsx("a",{href:"/account/password",className:"nav-link",children:"Ganti Password"}),(0,s.jsxs)("span",{className:"text-base text-muted",children:["Hi, ",s.jsx("span",{className:"font-semibold text-strong",children:t.username})]}),s.jsx("a",{href:"/logout",className:"glass-button px-4 py-2 text-sm",children:"Logout"})]}):s.jsx("a",{href:"/login",className:"glass-button px-4 py-2 text-sm",children:"Login"})})]})}),s.jsx("main",{className:"app-container",children:s.jsx("div",{className:"page-stack animate-fade-in",children:e})}),s.jsx("script",{src:"/js/pos.js",defer:!0})]})}},899:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>o,metadata:()=>i});var s=a(9510),r=a(7211),n=a(8035);a(7272);let i={title:n.k.name+" POS"};function o({children:e}){return s.jsx("html",{lang:"id",children:s.jsx("body",{className:`${r.className} min-h-screen font-display`,children:e})})}},8035:(e,t,a)=>{"use strict";a.d(t,{i:()=>c,k:()=>o});var s=a(5315),r=a(7360),n=a(6636);let i=s.dirname(r.fileURLToPath("file:///C:/coffee-pos/config/shop.js"));n.config({path:s.join(i,"..",".env")});let o={name:process.env.SHOP_NAME||"Kasir Warung Agen Sembako",address:process.env.SHOP_ADDRESS||"Jl. Contoh No. 123, Kota",receipt_footer:process.env.RECEIPT_FOOTER||"Terima kasih sudah berbelanja!"},c=["Makanan","Minuman","Bumbu Dapur","Sabun","Kebutuhan Rumah Tangga","Tembakau","Sampo","Obat-obatan"]},7905:(e,t,a)=>{"use strict";a.r(t),a.d(t,{orderItems:()=>h,orders:()=>m,products:()=>p,schema:()=>g,userRoleEnum:()=>l,users:()=>u});var s=a(5396),r=a(8324),n=a(5961),i=a(2140),o=a(4374),c=a(8748),d=a(1575);let l=(0,s.ys)("user_role",["admin","cashier"]),u=(0,r.af)("users",{id:(0,n.eP)("id").primaryKey(),username:(0,i.fL)("username").notNull().unique(),passwordHash:(0,i.fL)("password_hash").notNull(),role:l("role").notNull().default("cashier")}),p=(0,r.af)("products",{id:(0,n.eP)("id").primaryKey(),name:(0,i.fL)("name").notNull(),sku:(0,i.fL)("sku").unique(),price:(0,o._L)("price").notNull(),category:(0,i.fL)("category"),stock:(0,o._L)("stock").notNull().default(0),isActive:(0,c.O7)("is_active").notNull().default(!0)}),m=(0,r.af)("orders",{id:(0,n.eP)("id").primaryKey(),createdAt:(0,d.AB)("created_at",{withTimezone:!1}).defaultNow().notNull(),cashier:(0,i.fL)("cashier"),total:(0,o._L)("total").notNull(),paymentMethod:(0,i.fL)("payment_method").notNull().default("cash"),cashReceived:(0,o._L)("cash_received"),changeAmount:(0,o._L)("change_amount")}),h=(0,r.af)("order_items",{id:(0,n.eP)("id").primaryKey(),orderId:(0,o._L)("order_id").notNull().references(()=>m.id,{onDelete:"cascade"}),productId:(0,o._L)("product_id").references(()=>p.id,{onDelete:"set null"}),productName:(0,i.fL)("product_name").notNull(),productSku:(0,i.fL)("product_sku"),qty:(0,o._L)("qty").notNull(),priceEach:(0,o._L)("price_each").notNull(),lineTotal:(0,o._L)("line_total").notNull()}),g={users:u,products:p,orders:m,orderItems:h}},8855:(e,t,a)=>{"use strict";a.d(t,{O:()=>u,Ov:()=>d,ed:()=>c,xn:()=>l});var s=a(1615),r=a(6091),n=a(6176);let i="session";function o(){let e=process.env.SESSION_SECRET||"dev-session-secret";return new TextEncoder().encode(e)}async function c(e){let t=await new r.N({sub:String(e.id),username:e.username,role:e.role}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(o());(0,s.cookies)().set(i,t,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:28800})}function d(){(0,s.cookies)().set(i,"",{httpOnly:!0,path:"/",maxAge:0})}async function l(){let e=s.cookies().get(i)?.value;if(!e)return null;try{let{payload:t}=await (0,n._)(e,o());return{id:t.sub,username:t.username,role:t.role}}catch(e){return null}}async function u(e="/login"){let t=await l();if(!t)try{let{redirect:t}=await a.e(585).then(a.bind(a,8585));t(e)}catch(t){return{redirect:e}}return{user:t}}},53:(e,t,a)=>{"use strict";a.a(e,async(e,s)=>{try{a.d(t,{db:()=>l,f:()=>o});var r=a(8683),n=a(2237),i=a(4893),o=a(7905);let e=process.env.DATABASE_URL;if(!e)throw Error("DATABASE_URL is not set");let c=globalThis.WebSocket||i.ZP;globalThis.WebSocket||(globalThis.WebSocket=c);let d=globalThis.__neonClient;d||(d=new n.KU({connectionString:e,fetchEndpoint:process.env.NEON_FETCH_ENDPOINT,webSocketConstructor:c}),await d.connect(),globalThis.__neonClient=d);let l=(0,r.t)(d,{schema:o});s()}catch(e){s(e)}},1)}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[276,840,153,891,169],()=>a(5483));module.exports=s})();