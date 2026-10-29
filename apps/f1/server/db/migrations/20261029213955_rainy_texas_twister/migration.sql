CREATE TABLE "f1_responses" (
	"path" text,
	"query" text,
	"data" jsonb NOT NULL,
	"fetchedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "f1_responses_pkey" PRIMARY KEY("path","query")
);
