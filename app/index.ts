import { count, sql } from 'drizzle-orm';
import { Elysia } from 'elysia';
import { audios } from './db/schema';

import process from 'process'
import {config} from 'dotenv'
import { getDb } from './db';
config()

export const app = new Elysia({ aot: false, serve: { idleTimeout: 0 } })
  .onError(({ code, error }: any) => {
    return {
      success: false,
      message: "An error has occurred while requesting",
      code: `${error.status} (${code})`,
    };
  })
  .get('/', async ({}) => {
    const db = getDb()
    return{
      total:await db.select({ count: count() }).from(audios),
    }
  })
  .use(import('./routes/sync'))



console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);