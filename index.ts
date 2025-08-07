import { drizzle } from "drizzle-orm/d1";
import { app } from "./app"
import { type Context,Elysia } from "elysia"
import { setDb } from "./app/db";

export default {
  async fetch(
    request: Request,
    env: typeof process.env,
    ctx: Context,
  ): Promise<Response> {
    const db = drizzle(env.D1)
    setDb(db)
    process.env = env; // 将环境变量注入到 Node.js 进程中
    // 将 env 注入 Elysia 实例
    return await new Elysia({ aot: false })
      .use(app)
      .fetch(request)
  },
}

