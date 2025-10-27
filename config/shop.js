import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const SHOP = {
  name: process.env.SHOP_NAME || 'Kasir Warung Agen Sembako',
  address: process.env.SHOP_ADDRESS || 'Jl. Contoh No. 123, Kota',
  receipt_footer: process.env.RECEIPT_FOOTER || 'Terima kasih sudah berbelanja!',
};

export const STANDARD_CATEGORIES = [
  'Makanan',
  'Minuman',
  'Bumbu Dapur',
  'Sabun',
  'Kebutuhan Rumah Tangga',
];

