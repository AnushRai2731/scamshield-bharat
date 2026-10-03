CREATE TABLE "analyses" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"input_type" text NOT NULL,
	"risk_level" text NOT NULL,
	"record" jsonb NOT NULL
);
