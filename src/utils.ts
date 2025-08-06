import { NotionAPI } from 'notion-client';
import type { Block, PageChunk } from 'notion-types';

export async function getAllCollectionData() {
    const notion = new NotionAPI();
    const collection_id = Bun.env.SOURCE_COLLECTION_ID;
    const collection_view_id = Bun.env.SOURCE_COLLECTION_VIEW_ID;

    if (!collection_id || !collection_view_id) {
        return []
    }

    const collection = await notion.getCollectionData(
        collection_id,
        collection_view_id,
        undefined,
        { limit: 99999,type:'reducer' }
    )

    const blockIds = collection.result.reducerResults?.collection_group_results.blockIds || [];

    const groupedBlockIds: string[][] = [];

    for (let i = 0; i < blockIds.length; i += 100) {
        groupedBlockIds.push(blockIds.slice(i, i + 100));
    }

    const all_blocks: Block[] = [];
    for(const ids of groupedBlockIds) {
        const chunk = await notion.getBlocks(ids);
        let blocks = Object.values(chunk.recordMap.block).map(x=>{
            return x.value;
        })
        all_blocks.push(...blocks);
        //console.log(`Fetched ${blocks.length} blocks in this chunk`);
        
    }

    return applySchemaToBlocks(
        collection.recordMap.collection?.[collection_id]?.value?.schema?? {},
        all_blocks
    ).map(x=>x.propertiesFormatted);
}

type Schema = Record<string, { name: string; type: string }>;

type BlockWithSchema = Block & { propertiesFormatted?: Record<string, any> };

export function applySchemaToBlocks(
    schema: Schema,
    blocks: Block[]
): BlockWithSchema[] {
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