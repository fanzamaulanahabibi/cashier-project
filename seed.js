import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import { db, schema } from './drizzle/client.js';
import { count, eq } from 'drizzle-orm';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const adminUser = process.env.ADMIN_USERNAME || 'admin';
const configuredPass = process.env.ADMIN_PASSWORD;

async function seed() {
  const exists = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.username, adminUser)).limit(1);
  if (exists.length === 0) {
    const adminPass = configuredPass || crypto.randomBytes(18).toString('base64');
    const hash = bcrypt.hashSync(adminPass, 12);
    await db.insert(schema.users).values({ username: adminUser, passwordHash: hash, role: 'admin' });
    console.log('Admin user created.');
    console.log(`  Username: ${adminUser}`);
    if (configuredPass) console.log('  Password: Loaded from ADMIN_PASSWORD environment variable.');
    else {
      console.log('  Password (generated):', adminPass);
      console.log('  Please store this password securely and change it after first login.');
    }
  } else {
    console.log('Admin user already exists');
  }

  const cnt = await db.select({ c: count() }).from(schema.products);
  const c = Number(cnt?.[0]?.c || 0);
  if (c === 0) {
    const sample = [
      ['Espresso', 'ESP001', 18000, 'Minuman', 100],
      ['Americano', 'AME001', 22000, 'Minuman', 100],
      ['Cappuccino', 'CAP001', 25000, 'Minuman', 100],
      ['Latte', 'LAT001', 26000, 'Minuman', 100],
      ['Mocha', 'MOC001', 28000, 'Minuman', 100],
      ['Lemon Tea', 'TEA001', 15000, 'Minuman', 100],
      ['Croissant', 'MAKAN001', 20000, 'Makanan', 50],
      ['Brownies', 'MAKAN002', 18000, 'Makanan', 50],
      ['Gula Pasir 1kg', 'DAPUR001', 14000, 'Bumbu Dapur', 40],
      ['Minyak Goreng 1L', 'DAPUR002', 22000, 'Bumbu Dapur', 40],
      ['Sabun Mandi', 'SAB001', 5000, 'Sabun', 80],
      ['Detergen Sachet', 'SAB002', 4000, 'Sabun', 90],
      ['Plastik Sampah 30L', 'RUM001', 12000, 'Kebutuhan Rumah Tangga', 30]
    ];
    await db.insert(schema.products).values(sample.map(([name, sku, price, category, stock]) => ({ name, sku, price, category, stock, isActive: true })));
    console.log('Sample products inserted');
  } else {
    console.log('Products already seeded');
  }
}

seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
