import path from 'path';
import url from 'url';
import bcrypt from 'bcryptjs';
import { db, schema } from '../drizzle/client.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import crypto from 'crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

function parseArgs(argv) {
  const result = { role: 'cashier' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if ((arg === '--username' || arg === '-u') && argv[i + 1]) {
      result.username = argv[i + 1];
      i += 1;
    } else if ((arg === '--password' || arg === '-p') && argv[i + 1]) {
      result.password = argv[i + 1];
      i += 1;
    } else if ((arg === '--role' || arg === '-r') && argv[i + 1]) {
      result.role = argv[i + 1].toLowerCase();
      i += 1;
    }
  }
  return result;
}

const options = parseArgs(process.argv.slice(2));

if (!options.username) {
  console.error('Username is required. Usage: npm run create-user -- --username <name> [--password <pass>] [--role admin|cashier]');
  process.exit(1);
}

if (!['admin', 'cashier'].includes(options.role)) {
  console.error("Role must be either 'admin' or 'cashier'.");
  process.exit(1);
}

if (!options.password) {
  options.password = crypto.randomBytes(12).toString('base64');
  options.generated = true;
}

if (options.password.length < 8) {
  console.error('Password must be at least 8 characters long.');
  process.exit(1);
}

const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.username, options.username)).limit(1);
if (existing[0]) {
  console.error(`User '${options.username}' already exists.`);
  process.exit(1);
}

const hash = bcrypt.hashSync(options.password, 12);
await db.insert(schema.users).values({ username: options.username, passwordHash: hash, role: options.role });

console.log(`User '${options.username}' created with role '${options.role}'.`);
if (options.generated) {
  console.log('Generated password:', options.password);
  console.log('Please store it securely and rotate after first login.');
}

process.exit(0);
