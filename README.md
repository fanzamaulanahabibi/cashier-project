# Coffee POS (Next.js + Postgres)

Aplikasi kasir sederhana untuk warung/coffee shop, dibangun dengan Next.js (App Router), Drizzle ORM, dan PostgreSQL (driver Neon HTTP).

## Fitur
- Login (admin/cashier) dengan cookie JWT httpOnly
- Halaman kasir: pilih produk, keranjang, pembayaran cash/non-cash, otomatis membuat order
- Manajemen produk (CRUD, stok, aktif/nonaktif)
- Riwayat order & struk siap cetak (58mm)
- Laporan harian/bulanan dan export CSV
- Format mata uang IDR dan UI ringan (Tailwind CDN)

## Persiapan
1. Pastikan Node.js 18.17 – 20.x terpasang.
2. Siapkan database Postgres (contoh: Neon) dan salin connection string ke `DATABASE_URL`.
3. Salin env contoh dan sesuaikan nilai:
   - PowerShell: `Copy-Item .env.example .env`
   - Bash: `cp .env.example .env`
   Isi `SESSION_SECRET`, `SHOP_*`, dan `DATABASE_URL`.

## Menjalankan secara lokal
```
npm install
npm run db:migrate       # memastikan schema tersedia
npm run create-user -- --username admin --role admin   # password acak akan dicetak
npm run dev              # buka http://localhost:3000
```

## Perintah utilitas
- Reset password: `npm run reset-password -- --username admin --password Baru12345`
- Tambah user: `npm run create-user -- --username kasir2 --password Rahasia123 --role cashier`
- Migrasi DB: `npm run db:migrate`

## Struktur Proyek (ringkas)
```
app/                    # Next.js App Router (halaman & route API)
  api/                  # Route API (login, products, checkout, export)
  pos/, orders/, ...    # Halaman server components
drizzle/                # Schema dan client Drizzle
lib/                    # Auth (JWT cookie) & helper DB/transaction
public/                 # Asset statis (JS kecil, CSS)
scripts/                # CLI util (migrate, create-user, reset-password)
```

## Catatan Produksi
- Jangan commit `.env`. Set secret melalui environment variable platform.
- Gunakan `SESSION_SECRET` unik per lingkungan.
- Driver Neon HTTP (443) dipakai agar kompatibel di jaringan yang memblokir 5432.
- Pertimbangkan menonaktifkan Tailwind CDN dan beralih ke build Tailwind untuk aplikasi skala besar.

