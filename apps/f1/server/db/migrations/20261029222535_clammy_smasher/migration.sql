CREATE TABLE "push_devices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "push_devices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"endpoint" text NOT NULL UNIQUE,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sent_notifications" (
	"device_id" integer,
	"event" text,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sent_notifications_pkey" PRIMARY KEY("device_id","event")
);
--> statement-breakpoint
ALTER TABLE "f1_race_sent_notifications_free" DROP CONSTRAINT "f1_race_sent_notifications_free_SHb2IDJROAnl_fkey";--> statement-breakpoint
DROP TABLE "f1_race_push_devices_free";--> statement-breakpoint
DROP TABLE "f1_race_sent_notifications_free";--> statement-breakpoint
ALTER TABLE "sent_notifications" ADD CONSTRAINT "sent_notifications_device_id_push_devices_id_fkey" FOREIGN KEY ("device_id") REFERENCES "push_devices"("id") ON DELETE CASCADE;