/**
 * 获取并格式化 Notion 集合中的所有数据块。
 *
 * 此函数执行以下操作：
 * 1. 从环境变量中读取集合 ID 和视图 ID。
 * 2. 使用 notion-client 获取集合数据。
 * 3. 将所有块 ID 分组，每组最多 100 个，分批请求块详情。
 * 4. 合并所有块，并根据集合的 schema 格式化属性。
 * 5. 返回格式化后的块数组，每个对象包含格式化属性、更新时间和创建时间。
 *
 * @returns {Promise<Array<{ [key: string]: any, update_time: number, created_time: number }>>}
 * 返回格式化后的块对象数组。如果未设置集合 ID 或视图 ID，则返回空数组。
 */
import { NotionAPI } from 'notion-client';
import type { Block } from 'notion-types';
import process from 'process';
import type { Audio } from './db/schema';

export async function getAllCollectionData(limit = 99999) {
    const notion = new NotionAPI();
    const collection_id = process.env.SOURCE_COLLECTION_ID;
    const collection_view_id = process.env.SOURCE_COLLECTION_VIEW_ID;

    if (!collection_id || !collection_view_id) {
        return []
    }

    const collection = await notion.getCollectionData(
        collection_id,
        collection_view_id,
        undefined,
        { limit, type: 'reducer' }
    )

    const blockIds = collection.result.reducerResults?.collection_group_results.blockIds || [];

    const groupedBlockIds: string[][] = [];

    for (let i = 0; i < blockIds.length; i += 100) {
        groupedBlockIds.push(blockIds.slice(i, i + 100));
    }

    const all_blocks: Block[] = [];
    for (const ids of groupedBlockIds) {
        const chunk = await notion.getBlocks(ids);
        let blocks = Object.values(chunk.recordMap.block).map(x => {
            return x.value;
        })
        all_blocks.push(...blocks);
        //console.log(`Fetched ${blocks.length} blocks in this chunk`);

    }

    return (await applySchemaToBlocks(
        collection.recordMap.collection?.[collection_id]?.value?.schema ?? {},
        all_blocks
    )).map(x => { return { ...x.propertiesFormatted, update_time: x.last_edited_time, created_time: x.created_time } as any as Audio });
}

type Schema = Record<string, { name: string; type: string }>;

type BlockWithSchema = Block & { propertiesFormatted?: Record<string, any> };

/**
 * 将 Notion 块的属性格式化为更易读的形式。
 *
 * @param {Schema} schema - Notion 集合的 schema 定义。
 * @param {Block[]} blocks - 要格式化的 Notion 块数组。
 * @returns {BlockWithSchema[]} 返回包含格式化属性的块数组。
 */
export async function applySchemaToBlocks(
    schema: Schema,
    blocks: Block[]
): Promise<BlockWithSchema[]> {


    for (const [key] of Object.entries(schema)) {
        schema[key]!.name = {
            "播放量": "views",
            "金曲管理": "golden_song_management",
            "创作时代": "era_of_creation",
            "发布时间": "release_time",
            "风格": "style",
            "视频链接": "video_link",
            "全民制作人": "author",
            "随机～": "random",
            "哈基周金曲up主统计": "hajihami_top_up",
            "播放量（纯数字）": "views_number",
        }[schema[key]!.name] ?? schema[key]!.name;
        if (key === 'title')
            schema[key]!.name = 'title'; // 确保标题字段名为 'title'
    }

    return blocks.map((block) => {
        const properties = block.properties || {};
        const propertiesFormatted: Record<string, any> = {};

        for (const [key, value] of Object.entries(schema)) {
            const propValue = properties[key];

            if (propValue) {
                // Notion properties are arrays of arrays, e.g. [["value"]]
                propertiesFormatted[value.name] = propValue
                    .map((arr: any[]) => arr.join(''))
                    .join(', ');
            } else {
                propertiesFormatted[value.name] = null;
            }
        }

        return {
            ...block,
            propertiesFormatted,
        };
    });
}

// 保存为 JSON 文件
export async function saveToJson(data: any, filePath: string) {
  await Bun.write(filePath, JSON.stringify(data, null, 2));
  return filePath;
}
