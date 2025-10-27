import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'cashier']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('cashier'),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  price: integer('price').notNull(),
  category: text('category'),
  stock: integer('stock').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  cashier: text('cashier'),
  total: integer('total').notNull(),
  paymentMethod: text('payment_method').notNull().default('cash'),
  cashReceived: integer('cash_received'),
  changeAmount: integer('change_amount'),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),
  productSku: text('product_sku'),
  qty: integer('qty').notNull(),
  priceEach: integer('price_each').notNull(),
  lineTotal: integer('line_total').notNull(),
});

export const schema = { users, products, orders, orderItems };
