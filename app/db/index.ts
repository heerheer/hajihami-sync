import { DrizzleD1Database } from 'drizzle-orm/d1'

let dbInstance: DrizzleD1Database | null = null;

export function setDb(db: DrizzleD1Database) {
  dbInstance = db;
}

export function getDb() {
  if (!dbInstance) {
    throw new Error('DB instance not set. Call setDb() first.');
  }
  return dbInstance;
}