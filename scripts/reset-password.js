import path from 'path';
import url from 'url';
import bcrypt from 'bcryptjs';
import { db, schema } from '../drizzle/client.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const args = process.argv.slice(2);
let username = null;
let newPassword = null;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if ((arg === '--username' || arg === '-u') && args[i + 1]) {
    username = args[i + 1];
    i += 1;
  } else if ((arg === '--password' || arg === '-p') && args[i + 1]) {
    newPassword = args[i + 1];
    i += 1;
  }
}

if (!username || !newPassword) {
  console.error('Usage: node scripts/reset-password.js --username <name> --password <newPassword>');
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error('Password must be at least 8 characters long.');
  process.exit(1);
}

const userRows = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.username, username)).limit(1);
if (!userRows[0]) {
  console.error(`User '${username}' not found.`);
  process.exit(1);
}

const hash = bcrypt.hashSync(newPassword, 12);
await db.update(schema.users).set({ passwordHash: hash }).where(eq(schema.users.id, userRows[0].id));

console.log(`Password updated for user '${username}'.`);
console.log('Remember to distribute the new password securely.');
process.exit(0);
