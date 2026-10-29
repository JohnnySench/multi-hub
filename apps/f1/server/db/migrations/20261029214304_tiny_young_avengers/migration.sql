ALTER TABLE "f1_responses" ADD COLUMN "fetched_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "f1_responses" DROP COLUMN "fetchedAt";