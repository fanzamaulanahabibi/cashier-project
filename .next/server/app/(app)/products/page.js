(()=>{var e={};e.id=126,e.ids=[126],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1568:e=>{"use strict";e.exports=require("zlib")},2254:e=>{"use strict";e.exports=require("node:buffer")},6005:e=>{"use strict";e.exports=require("node:crypto")},7261:e=>{"use strict";e.exports=require("node:util")},8359:()=>{},948:()=>{},5600:(e,t,a)=>{"use strict";a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{GlobalError:()=>l.a,__next_app__:()=>x,originalPathname:()=>h,pages:()=>m,routeModule:()=>f,tree:()=>p});var r=a(4877);a(27),a(5866),a(899);var n=a(3191),i=a(8716),o=a(7922),l=a.n(o),c=a(5231),d={};for(let e in c)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>c[e]);a.d(t,d);var u=e([r]);r=(u.then?(await u)():u)[0];let p=["",{children:["(app)",{children:["products",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,4877)),"C:\\coffee-pos\\app\\(app)\\products\\page.jsx"]}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,27)),"C:\\coffee-pos\\app\\(app)\\layout.js"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}]},{layout:[()=>Promise.resolve().then(a.bind(a,899)),"C:\\coffee-pos\\app\\layout.js"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}],m=["C:\\coffee-pos\\app\\(app)\\products\\page.jsx"],h="/(app)/products/page",x={require:a,loadChunk:()=>Promise.resolve()},f=new n.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/(app)/products/page",pathname:"/products",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:p}});s()}catch(e){s(e)}})},7706:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,2994,23)),Promise.resolve().then(a.t.bind(a,6114,23)),Promise.resolve().then(a.t.bind(a,9727,23)),Promise.resolve().then(a.t.bind(a,9671,23)),Promise.resolve().then(a.t.bind(a,1868,23)),Promise.resolve().then(a.t.bind(a,4759,23))},3970:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,4064,23))},2621:()=>{},5303:()=>{},4877:(e,t,a)=>{"use strict";a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{default:()=>d,dynamic:()=>p});var r=a(9510),n=a(8855),i=a(53),o=a(4149),l=a(8035),c=e([i]);i=(c.then?(await c)():c)[0];let p="force-dynamic";async function d(){let{redirect:e}=await (0,n.O)();if(e)return null;let t=await (0,n.xn)(),a=t?.role==="admin",s=await i.db.select().from(i.f.products).orderBy((0,o.i6)`is_active DESC`,i.f.products.name),c=l.i,d=new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}),p=s.map(e=>{let t=e.category&&!c.includes(e.category);return a?`
          <tr class="transition" data-product-row="${e.id}">
            <form method="POST" action="/products/${e.id}/update">
              <td class="px-4 py-3"><input name="name" value="${u(e.name)}" class="w-full glass-input px-2 py-1 text-sm"></td>
              <td class="px-4 py-3"><input name="price" type="number" value="${e.price}" class="w-28 glass-input px-2 py-1 text-sm"></td>
              <td class="px-4 py-3"><input name="stock" type="number" value="${e.stock}" class="w-20 glass-input px-2 py-1 text-sm"></td>
              <td class="px-4 py-3">
                <select name="category" class="w-full glass-input px-2 py-1 text-sm">
                  <option value="">Tanpa kategori</option>
                  ${c.map(t=>`<option value="${u(t)}" ${e.category===t?"selected":""}>${u(t)}</option>`).join("")}
                  ${t?`<option value="${u(e.category)}" selected>${u(e.category)}</option>`:""}
                </select>
              </td>
              <td class="px-4 py-3 status-cell">
                <label class="status-toggle">
                  <input type="checkbox" class="status-toggle__input" name="is_active" ${e.isActive?"checked":""} />
                  <span>Aktif</span>
                </label>
              </td>
              <td class="px-4 py-3 action-cell">
                <div class="action-stack">
                  <input type="hidden" name="sku" value="${u(e.sku||"")}">
                  <button class="action-pill primary">Update</button>
            </form>
                  <button type="button" class="action-pill danger" data-delete-product="${e.id}">Hapus</button>
                </div>
              </td>
          </tr>`:`
        <tr class="transition" data-product-row="${e.id}">
          <td class="px-4 py-3">${u(e.name)}</td>
          <td class="px-4 py-3">${d.format(e.price)}</td>
          <td class="px-4 py-3">${e.stock}</td>
          <td class="px-4 py-3">${u(e.category||"-")}</td>
          <td class="px-4 py-3 status-cell"><span class="badge-soft ${e.isActive?"":"inactive"}">${e.isActive?"Aktif":"Nonaktif"}</span></td>
          <td class="px-4 py-3 text-subtle text-xs">Khusus admin</td>
        </tr>`}).join(""),m=String.raw`
(function(){
  function ready(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  ready(() => {
    const form = document.getElementById("new-product-form");
    const feedback = document.getElementById("product-feedback");
    const badge = document.querySelector('[data-product-count]');
    const tableBody = document.querySelector('[data-products-table]');

    function showFeedback(message, success){
      if(!feedback) return;
      if(!message){
        feedback.textContent = "";
        feedback.classList.add("hidden");
        feedback.classList.remove("success","error");
        return;
      }
      feedback.textContent = message;
      feedback.classList.remove("hidden","success","error");
      feedback.classList.add(success ? "success" : "error");
    }

    function ensureBadgeState(){
      if(!badge) return;
      if(!badge.dataset.productCount){
        const initial = parseInt(badge.textContent, 10);
        if(!Number.isNaN(initial)) badge.dataset.productCount = String(initial);
      }
    }

    function adjustCount(delta){
      if(!badge) return;
      const current = parseInt(badge.dataset.productCount || badge.textContent, 10) || 0;
      const next = Math.max(0, current + delta);
      badge.dataset.productCount = String(next);
      badge.textContent = next + ' item';
    }

    async function performDelete(id, row){
      try {
        const res = await fetch('/api/products/' + id, { method: 'DELETE' });
        const payload = await res.json();
        if(!res.ok) throw new Error(payload.error || 'Gagal menghapus produk');
        if(row) row.remove();
        adjustCount(-1);
        showFeedback('Produk berhasil dihapus.', true);
      } catch (err) {
        showFeedback((err && err.message) || 'Terjadi kesalahan saat menghapus produk.', false);
      }
    }

    ensureBadgeState();

    if(form){
      form.addEventListener('submit', async (ev)=>{
        ev.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const payload = await res.json();
          if(!res.ok) throw new Error(payload.error || 'Gagal menambah produk');
          showFeedback('Produk berhasil ditambahkan.', true);
          setTimeout(()=>location.reload(), 700);
        } catch (err) {
          showFeedback((err && err.message) || 'Terjadi kesalahan saat menambah produk.', false);
        }
      });
    }

    document.querySelectorAll('[data-delete-product]').forEach((btn)=>{
      btn.addEventListener('click', async (event)=>{
        if(event){
          event.preventDefault();
          event.stopPropagation();
        }
        const id = btn.getAttribute('data-delete-product');
        if(!id) return;
        const row = tableBody ? tableBody.querySelector('[data-product-row="' + id + '"]') : null;
        const nameInput = row ? row.querySelector('input[name="name"]') : null;
        const label = nameInput ? nameInput.value.trim() : (row ? row.querySelector('td')?.textContent?.trim() : '');

        if(window.confirm(label ? 'Hapus produk "' + label + '"?' : 'Hapus produk ini?')){
          await performDelete(id, row);
        }
      });
    });
  });
})();
`;return(0,r.jsxs)("div",{className:"page-stack animate-fade-in",children:[(0,r.jsxs)("div",{className:"section-heading",children:[r.jsx("span",{className:"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider w-max",children:"Rak Produk"}),r.jsx("h1",{className:"heading-xl",children:"Manajemen Produk"}),r.jsx("p",{className:"text-lead",children:"Tambah, perbarui, dan atur stok barang warung dengan tampilan yang bersih dan mudah dipindai."})]}),(0,r.jsxs)("div",{className:"grid gap-6 xl:grid-cols-[1.05fr_minmax(0,1fr)]",children:[(0,r.jsxs)("section",{className:"section-card space-y-5",children:[(0,r.jsxs)("header",{className:"section-heading",children:[r.jsx("h2",{className:"text-2xl font-semibold text-strong",children:"Tambah Produk Baru"}),r.jsx("p",{className:"text-sm text-muted",children:"Form sederhana untuk menambahkan item ke katalog Anda."})]}),a?(0,r.jsxs)(r.Fragment,{children:[r.jsx("div",{id:"product-feedback",className:"form-feedback hidden"}),(0,r.jsxs)("form",{id:"new-product-form",className:"form-grid form-grid--two",children:[(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block",children:"Nama"}),r.jsx("input",{name:"name",className:"glass-input w-full px-3 py-2",required:!0})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block",children:"SKU"}),r.jsx("input",{name:"sku",className:"glass-input w-full px-3 py-2"})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block",children:"Harga (IDR)"}),r.jsx("input",{type:"number",name:"price",min:"0",className:"glass-input w-full px-3 py-2",required:!0})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block",children:"Kategori"}),(0,r.jsxs)("select",{name:"category",className:"glass-input w-full px-3 py-2",children:[r.jsx("option",{value:"",children:"Pilih kategori"}),c.map(e=>r.jsx("option",{value:e,children:e},e))]})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block",children:"Stok"}),r.jsx("input",{type:"number",name:"stock",min:"0",className:"glass-input w-full px-3 py-2"})]}),r.jsx("div",{className:"section-actions",children:r.jsx("button",{className:"glass-button px-4 py-2.5 font-semibold",children:"Simpan Produk"})})]}),r.jsx("script",{dangerouslySetInnerHTML:{__html:m}})]}):r.jsx("p",{className:"text-sm text-muted",children:"Hanya admin yang dapat menambahkan produk baru."})]}),(0,r.jsxs)("section",{className:"table-card",children:[(0,r.jsxs)("div",{className:"table-toolbar",children:[(0,r.jsxs)("div",{children:[r.jsx("h2",{className:"text-xl font-semibold text-strong",children:"Daftar Produk"}),r.jsx("p",{className:"text-sm text-muted",children:"Edit langsung pada kolom untuk memperbarui data."})]}),(0,r.jsxs)("span",{className:"badge-soft","data-product-count":!0,children:[s.length," item"]})]}),r.jsx("div",{className:"table-responsive",dangerouslySetInnerHTML:{__html:`
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody data-products-table>
                ${p}
              </tbody>
            </table>
          `}})]})]})]})}function u(e){return String(e||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}s()}catch(e){s(e)}})},7272:()=>{},27:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>o});var s=a(9510),r=a(9720),n=a(8855),i=a(8035);async function o({children:e}){let t=await (0,n.xn)(),a=t?.role==="admin";return(0,s.jsxs)(s.Fragment,{children:[s.jsx(r.default,{id:"app-utils",strategy:"beforeInteractive",children:"window.formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);"}),s.jsx(r.default,{src:"https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js",strategy:"afterInteractive"}),s.jsx("nav",{className:"navbar",children:(0,s.jsxs)("div",{className:"nav-inner max-w-6xl mx-auto",children:[(0,s.jsxs)("div",{className:"nav-brand flex items-center gap-3",children:[s.jsx("span",{className:"inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand font-semibold shadow-soft",children:"KW"}),(0,s.jsxs)("div",{children:[s.jsx("p",{className:"text-xs uppercase tracking-wider text-subtle",children:"Warung Sembako"}),s.jsx("p",{className:"text-lg font-semibold text-strong",children:i.k.name})]})]}),s.jsx("input",{type:"checkbox",id:"nav-toggle",className:"nav-toggle","aria-controls":"main-menu","aria-label":"Toggle menu"}),(0,s.jsxs)("label",{htmlFor:"nav-toggle",className:"nav-toggle-btn","aria-hidden":"true",children:[s.jsx("span",{}),s.jsx("span",{}),s.jsx("span",{})]}),s.jsx("div",{className:"nav-links flex items-center gap-3 text-sm",id:"main-menu",children:t?(0,s.jsxs)(s.Fragment,{children:[s.jsx("a",{href:"/pos",className:"nav-link",children:"Kasir"}),s.jsx("a",{href:"/orders",className:"nav-link",children:"Riwayat"}),a&&s.jsx("a",{href:"/reports/daily",className:"nav-link",children:"Laporan"}),a&&s.jsx("a",{href:"/products",className:"nav-link",children:"Produk"}),a&&s.jsx("a",{href:"/users",className:"nav-link",children:"Pengguna"}),(0,s.jsxs)("span",{className:"text-base text-muted",children:["Hi, ",s.jsx("span",{className:"font-semibold text-strong",children:t.username})]}),s.jsx("a",{href:"/logout",className:"glass-button px-4 py-2 text-sm",children:"Logout"})]}):s.jsx("a",{href:"/login",className:"glass-button px-4 py-2 text-sm",children:"Login"})})]})}),s.jsx("main",{className:"app-container",children:s.jsx("div",{className:"page-stack animate-fade-in",children:e})}),s.jsx("script",{src:"/js/pos.js",defer:!0})]})}},899:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>o,metadata:()=>i});var s=a(9510),r=a(7211),n=a(8035);a(7272);let i={title:n.k.name+" POS"};function o({children:e}){return s.jsx("html",{lang:"id",children:s.jsx("body",{className:`${r.className} min-h-screen font-display`,children:e})})}},8035:(e,t,a)=>{"use strict";a.d(t,{i:()=>l,k:()=>o});var s=a(5315),r=a(7360),n=a(6636);let i=s.dirname(r.fileURLToPath("file:///C:/coffee-pos/config/shop.js"));n.config({path:s.join(i,"..",".env")});let o={name:process.env.SHOP_NAME||"Kasir Warung Agen Sembako",address:process.env.SHOP_ADDRESS||"Jl. Contoh No. 123, Kota",receipt_footer:process.env.RECEIPT_FOOTER||"Terima kasih sudah berbelanja!"},l=["Makanan","Minuman","Bumbu Dapur","Sabun","Kebutuhan Rumah Tangga"]},7905:(e,t,a)=>{"use strict";a.r(t),a.d(t,{orderItems:()=>h,orders:()=>m,products:()=>p,schema:()=>x,userRoleEnum:()=>d,users:()=>u});var s=a(5396),r=a(8324),n=a(5961),i=a(2140),o=a(4374),l=a(8748),c=a(1575);let d=(0,s.ys)("user_role",["admin","cashier"]),u=(0,r.af)("users",{id:(0,n.eP)("id").primaryKey(),username:(0,i.fL)("username").notNull().unique(),passwordHash:(0,i.fL)("password_hash").notNull(),role:d("role").notNull().default("cashier")}),p=(0,r.af)("products",{id:(0,n.eP)("id").primaryKey(),name:(0,i.fL)("name").notNull(),sku:(0,i.fL)("sku").unique(),price:(0,o._L)("price").notNull(),category:(0,i.fL)("category"),stock:(0,o._L)("stock").notNull().default(0),isActive:(0,l.O7)("is_active").notNull().default(!0)}),m=(0,r.af)("orders",{id:(0,n.eP)("id").primaryKey(),createdAt:(0,c.AB)("created_at",{withTimezone:!1}).defaultNow().notNull(),cashier:(0,i.fL)("cashier"),total:(0,o._L)("total").notNull(),paymentMethod:(0,i.fL)("payment_method").notNull().default("cash"),cashReceived:(0,o._L)("cash_received"),changeAmount:(0,o._L)("change_amount")}),h=(0,r.af)("order_items",{id:(0,n.eP)("id").primaryKey(),orderId:(0,o._L)("order_id").notNull().references(()=>m.id,{onDelete:"cascade"}),productId:(0,o._L)("product_id").references(()=>p.id,{onDelete:"set null"}),productName:(0,i.fL)("product_name").notNull(),productSku:(0,i.fL)("product_sku"),qty:(0,o._L)("qty").notNull(),priceEach:(0,o._L)("price_each").notNull(),lineTotal:(0,o._L)("line_total").notNull()}),x={users:u,products:p,orders:m,orderItems:h}},8855:(e,t,a)=>{"use strict";a.d(t,{O:()=>u,Ov:()=>c,ed:()=>l,xn:()=>d});var s=a(1615),r=a(6091),n=a(6176);let i="session";function o(){let e=process.env.SESSION_SECRET||"dev-session-secret";return new TextEncoder().encode(e)}async function l(e){let t=await new r.N({sub:String(e.id),username:e.username,role:e.role}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(o());(0,s.cookies)().set(i,t,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:28800})}function c(){(0,s.cookies)().set(i,"",{httpOnly:!0,path:"/",maxAge:0})}async function d(){let e=s.cookies().get(i)?.value;if(!e)return null;try{let{payload:t}=await (0,n._)(e,o());return{id:t.sub,username:t.username,role:t.role}}catch(e){return null}}async function u(e="/login"){let t=await d();if(!t)try{let{redirect:t}=await a.e(585).then(a.bind(a,8585));t(e)}catch(t){return{redirect:e}}return{user:t}}},53:(e,t,a)=>{"use strict";a.a(e,async(e,s)=>{try{a.d(t,{db:()=>d,f:()=>o});var r=a(8683),n=a(2237),i=a(4893),o=a(7905);let e=process.env.DATABASE_URL;if(!e)throw Error("DATABASE_URL is not set");let l=globalThis.WebSocket||i.ZP;globalThis.WebSocket||(globalThis.WebSocket=l);let c=globalThis.__neonClient;c||(c=new n.KU({connectionString:e,fetchEndpoint:process.env.NEON_FETCH_ENDPOINT,webSocketConstructor:l}),await c.connect(),globalThis.__neonClient=c);let d=(0,r.t)(c,{schema:o});s()}catch(e){s(e)}},1)}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[276,840,153,891,169],()=>a(5600));module.exports=s})();