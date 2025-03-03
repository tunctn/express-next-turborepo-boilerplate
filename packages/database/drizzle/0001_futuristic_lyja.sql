CREATE TYPE "public"."log_levels" AS ENUM('error', 'warn', 'success', 'info', 'http', 'verbose', 'debug', 'silly');--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"level" "log_levels" NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb,
	"stack" text,
	"api_version" text,
	"user_id" text,
	"scope" text
);
--> statement-breakpoint
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "level_message_index" ON "system_logs" USING btree ("level","message");--> statement-breakpoint
CREATE INDEX "level_created_at_index" ON "system_logs" USING btree ("level","created_at");