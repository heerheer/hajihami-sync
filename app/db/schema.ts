import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const audios = sqliteTable("audios", {
    views: int(),
    golden_song_management: text(),
    era_of_creation: text(),
    release_time: text(),
    style: text(),
    video_link: text(),
    author: text(),
    random: int(),
    hajihami_top_up: text(),
    views_number: int(),
    title: text().unique()
});

export type Audio = typeof audios.$inferSelect;

