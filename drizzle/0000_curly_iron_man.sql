CREATE TABLE `audios` (
	`views` integer,
	`golden_song_management` text,
	`era_of_creation` text,
	`release_time` text,
	`style` text,
	`video_link` text,
	`author` text,
	`random` integer,
	`hajihami_top_up` text,
	`views_number` integer,
	`title` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audios_title_unique` ON `audios` (`title`);