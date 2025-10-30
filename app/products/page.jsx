import { requireUserOrRedirect, getSessionUser } from '../../lib/auth.js';
import { db, schema } from '../../lib/db.js';
import { sql } from 'drizzle-orm';
import { STANDARD_CATEGORIES } from '../../config/shop.js';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const { redirect } = await requireUserOrRedirect();
  if (redirect) return null;
  const user = await getSessionUser();
  const isAdmin = user?.role === 'admin';

  const rows = await db.select().from(schema.products).orderBy(sql`is_active DESC`, schema.products.name);
  const categoryOptions = STANDARD_CATEGORIES;

  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  const tableRowsHtml = rows
    .map((r) => {
      const hasCustomCategory = r.category && !categoryOptions.includes(r.category);
      if (isAdmin) {
        return `
          <tr class="transition" data-product-row="${r.id}">
            <form method="POST" action="/products/${r.id}/update">
              <td class="px-4 py-3"><input name="name" value="${escapeHtml(r.name)}" class="w-full glass-input px-2 py-1 text-sm"></td>
              <td class="px-4 py-3"><input name="price" type="number" value="${r.price}" class="w-28 glass-input px-2 py-1 text-sm"></td>
              <td class="px-4 py-3"><input name="stock" type="number" value="${r.stock}" class="w-20 glass-input px-2 py-1 text-sm"></td>
              <td class="px-4 py-3">
                <select name="category" class="w-full glass-input px-2 py-1 text-sm">
                  <option value="">Tanpa kategori</option>
                  ${categoryOptions
                    .map(
                      (cat) => `<option value="${escapeHtml(cat)}" ${r.category === cat ? 'selected' : ''}>${escapeHtml(cat)}</option>`,
                    )
                    .join('')}
                  ${hasCustomCategory ? `<option value="${escapeHtml(r.category)}" selected>${escapeHtml(r.category)}</option>` : ''}
                </select>
              </td>
              <td class="px-4 py-3 status-cell">
                <label class="status-toggle">
                  <input type="checkbox" class="status-toggle__input" name="is_active" ${r.isActive ? 'checked' : ''} />
                  <span>Aktif</span>
                </label>
              </td>
              <td class="px-4 py-3 action-cell">
                <div class="action-stack">
                  <input type="hidden" name="sku" value="${escapeHtml(r.sku || '')}">
                  <button class="action-pill primary">Update</button>
            </form>
                  <button type="button" class="action-pill danger" data-delete-product="${r.id}">Hapus</button>
                </div>
              </td>
          </tr>`;
      }
      return `
        <tr class="transition" data-product-row="${r.id}">
          <td class="px-4 py-3">${escapeHtml(r.name)}</td>
          <td class="px-4 py-3">${formatter.format(r.price)}</td>
          <td class="px-4 py-3">${r.stock}</td>
          <td class="px-4 py-3">${escapeHtml(r.category || '-')}</td>
          <td class="px-4 py-3 status-cell"><span class="badge-soft ${r.isActive ? '' : 'inactive'}">${r.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
          <td class="px-4 py-3 text-subtle text-xs">Khusus admin</td>
        </tr>`;
    })
    .join('');

  const managementScript = String.raw`
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
`;

  return (
    <div className="page-stack animate-fade-in">
      <div className="section-heading">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider w-max">Rak Produk</span>
        <h1 className="heading-xl">Manajemen Produk</h1>
        <p className="text-lead">Tambah, perbarui, dan atur stok barang warung dengan tampilan yang bersih dan mudah dipindai.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_minmax(0,1fr)]">
        <section className="section-card space-y-5">
          <header className="section-heading">
            <h2 className="text-2xl font-semibold text-strong">Tambah Produk Baru</h2>
            <p className="text-sm text-muted">Form sederhana untuk menambahkan item ke katalog Anda.</p>
          </header>
          {isAdmin ? (
            <>
              <div id="product-feedback" className="form-feedback hidden"></div>
              <form id="new-product-form" className="form-grid form-grid--two">
                <div>
                  <label className="block">Nama</label>
                  <input name="name" className="glass-input w-full px-3 py-2" required />
                </div>
                <div>
                  <label className="block">SKU</label>
                  <input name="sku" className="glass-input w-full px-3 py-2" />
                </div>
                <div>
                  <label className="block">Harga (IDR)</label>
                  <input type="number" name="price" min="0" className="glass-input w-full px-3 py-2" required />
                </div>
                <div>
                  <label className="block">Kategori</label>
                  <select name="category" className="glass-input w-full px-3 py-2">
                    <option value="">Pilih kategori</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Stok</label>
                  <input type="number" name="stock" min="0" className="glass-input w-full px-3 py-2" />
                </div>
                <div className="section-actions">
                  <button className="glass-button px-4 py-2.5 font-semibold">Simpan Produk</button>
                </div>
              </form>
              <script dangerouslySetInnerHTML={{ __html: managementScript }} />
            </>
          ) : (
            <p className="text-sm text-muted">Hanya admin yang dapat menambahkan produk baru.</p>
          )}
        </section>
        <section className="table-card">
          <div className="table-toolbar">
            <div>
              <h2 className="text-xl font-semibold text-strong">Daftar Produk</h2>
              <p className="text-sm text-muted">Edit langsung pada kolom untuk memperbarui data.</p>
            </div>
            <span className="badge-soft" data-product-count>{rows.length} item</span>
          </div>
          <div className="table-responsive" dangerouslySetInnerHTML={{ __html: `
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
                ${tableRowsHtml}
              </tbody>
            </table>
          ` }} />
        </section>
      </div>
    </div>
  );
}

function escapeHtml(s) {
  return String(s || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'", '&#39;');
}

