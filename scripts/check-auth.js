import { db, schema } from '../drizzle/client.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const args = process.argv.slice(2);
let username = null;
let password = null;
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if ((a === '--username' || a === '-u') && args[i + 1]) { username = args[i + 1]; i += 1; }
  else if ((a === '--password' || a === '-p') && args[i + 1]) { password = args[i + 1]; i += 1; }
}

if (!username) {
  console.error('Usage: node scripts/check-auth.js --username <name> [--password <pass>]');
  process.exit(1);
}

const rows = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
const user = rows[0];
if (!user) { console.error('User not found'); process.exit(2); }
console.log('Found user:', user.username, 'role=', user.role);
console.log('Hash prefix:', user.passwordHash.slice(0, 10) + '...');
if (password) {
  const ok = bcrypt.compareSync(password, user.passwordHash);
  console.log('Compare result:', ok);
}
process.exit(0);

