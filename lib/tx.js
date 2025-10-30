import { db } from './db.js';

export async function runInTransaction(work) {
  if (typeof db.transaction === 'function') {
    try {
      return await db.transaction(work);
    } catch (error) {
      const message = (error && error.message ? error.message : String(error || '')).toLowerCase();
      if (message.includes('no transactions support')) {
        return await work(db);
      }
      throw error;
    }
  }
  // Fallback: run non-transactionally if driver lacks tx
  return await work(db);
}
