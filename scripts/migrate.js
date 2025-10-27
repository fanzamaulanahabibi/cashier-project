import { pool } from '../drizzle/client.js';

const ddl = `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin','cashier');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'cashier'
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price INTEGER NOT NULL,
  category TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  cashier TEXT,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  cash_received INTEGER,
  change_amount INTEGER
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  qty INTEGER NOT NULL,
  price_each INTEGER NOT NULL,
  line_total INTEGER NOT NULL
);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(ddl);
    // Try to migrate existing users.role column to enum if it's still TEXT
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'role' AND udt_name = 'text'
        ) THEN
          ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
          ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;
          ALTER TABLE users ALTER COLUMN role SET DEFAULT 'cashier';
        END IF;
      END $$;
    `);
    await client.query('COMMIT');
    console.log('Database schema ensured.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e);
    process.exit(1);
  } finally {
    client.release();
  }
}

migrate().then(() => process.exit(0));
