import { drizzle } from 'drizzle-orm/neon-serverless';
import { Client } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../drizzle/schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const WebSocketImpl = globalThis.WebSocket || ws;
if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocketImpl;
}

let client = globalThis.__neonClient;

if (!client) {
  client = new Client({ connectionString, fetchEndpoint: process.env.NEON_FETCH_ENDPOINT, webSocketConstructor: WebSocketImpl });
  await client.connect();
  globalThis.__neonClient = client;
}

export const db = drizzle(client, { schema });
export { schema };
