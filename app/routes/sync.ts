import { Elysia, t } from "elysia";
import { getAllCollectionData } from "../utils";
import { audios } from "../db/schema";
import { getDb } from "../db";

const sync = new Elysia()
    .get("/sync", async ({ set, query: { skip, count } }) => {
        skip = skip ?? 0;
        count = count ?? 10;

        const parsedData = await getAllCollectionData(skip + count);
        const datas = parsedData.slice(skip, skip + count); // 只取指定范围的数据

        const db = getDb();
        // 按20个一组分组
        for (let i = 0; i < datas.length; i += 5) {
            const batch = datas.slice(i, i + 5);
            await db.insert(audios).values(batch).onConflictDoNothing();
            console.log(`Batch ${i / 5 + 1} processed successfully.`);
        }
        return {
            success: true,
            message: "Data synced successfully"
        }
    }, {
        query: t.Partial(
            t.Object({
                skip: t.Number({ default: 0 }),
                count: t.Number({ default: 10 })
            })
        )
    });

export default sync;