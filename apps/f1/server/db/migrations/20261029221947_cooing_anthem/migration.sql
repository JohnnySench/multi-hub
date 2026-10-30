CREATE TABLE "f1_race_push_devices_free" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "f1_race_push_devices_free_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"endpoint" text NOT NULL UNIQUE,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "f1_race_sent_notifications_free" (
	"device_id" integer,
	"event" text,
	"sent_at" timestamp with time zone NOT NULL,
	CONSTRAINT "f1_race_sent_notifications_free_pkey" PRIMARY KEY("device_id","event")
);
--> statement-breakpoint
ALTER TABLE "f1_race_sent_notifications_free" ADD CONSTRAINT "f1_race_sent_notifications_free_SHb2IDJROAnl_fkey" FOREIGN KEY ("device_id") REFERENCES "f1_race_push_devices_free"("id") ON DELETE CASCADE;