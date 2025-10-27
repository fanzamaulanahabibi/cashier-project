# Coffee POS (Express + SQLite)

Aplikasi kasir sederhana untuk coffee shop, dibuat dengan **Node.js (Express)**, **EJS**, dan **SQLite**.

## Fitur
- Login (admin/cashier)
- Halaman kasir: pilih produk, keranjang, pembayaran cash/QRIS/kartu, otomatis membuat order
- Manajemen produk (CRUD)
- Riwayat order & struk siap print
- Laporan penjualan harian (total transaksi & total penjualan)
- Format mata uang IDR

## Cara Menjalankan
1. Pastikan sudah terpasang **Node.js 18+**.
2. Salin contoh environment dan sesuaikan secretnya:
   ```bash
   cp .env.example .env   # (Windows PowerShell: Copy-Item .env.example .env)
   ```
   Edit `.env` dan ganti `SESSION_SECRET` dengan string acak yang kuat (atau jalankan seed di langkah berikut untuk membuatnya otomatis).
3. Extract ZIP ini, lalu buka folder di terminal:
   ```bash
   npm install
   npm run seed
   npm start
   ```
4. Perintah `npm run seed` akan:
   - Membuat admin default `admin`. Jika variabel `ADMIN_PASSWORD` tidak di-set, password acak akan digenerate dan ditampilkan di terminal.
   - Mengisi contoh produk ketika tabel masih kosong.
5. Buka `http://localhost:3000` dan login memakai kredensial yang dicetak saat proses seed.

## Mengatur Password Admin
- Untuk menentukan password sendiri saat seeding, set variabel lingkungan sebelum menjalankan `npm run seed`, misalnya:
  ```bash
  ADMIN_USERNAME=admin ADMIN_PASSWORD=SuperKuat123 npm run seed
  ```
  (PowerShell: `setx ADMIN_PASSWORD SuperKuat123`)
- Untuk mengganti password kapan saja sesudahnya:
  ```bash
  npm run reset-password -- --username admin --password PasswordBaru123
  ```
  Password minimal 8 karakter. Jalankan di server dan distribusikan secara aman.

## Menambah User Baru
- Buat admin atau kasir tambahan via CLI:
  ```bash
  npm run create-user -- --username kasir2 --password Rahasia123 --role cashier
  npm run create-user -- --username supervisor --role admin   # password acak akan dicetak
  ```
  Role default `cashier`. Jika tidak memberi `--password`, sistem akan membuat password acak (ditampilkan sekali di terminal).

## Struktur Proyek
```
.
├── data/                   # Database SQLite
├── db.js                   # Inisialisasi DB & schema
├── package.json
├── seed.js                 # Seed admin & sample produk
├── server.js               # App Express
├── views/                  # Template EJS (UI)
└── public/                 # Static assets
```

## Catatan Produksi
- Pastikan `.env` tidak ikut ter-commit dan `SESSION_SECRET` menggunakan nilai unik di setiap lingkungan.
- Simpan nilai admin/password dari seeding di tempat aman dan ubah setelah go-live.
- Pertimbangkan pindah ke PostgreSQL/MySQL untuk multi-user & skala besar.
- Tambahkan fitur seperti: diskon, pajak, multi-outlet, stok bahan baku, export CSV, dan peran pengguna yang lebih detail.
- Backup database `data/pos.sqlite` secara rutin.
```
