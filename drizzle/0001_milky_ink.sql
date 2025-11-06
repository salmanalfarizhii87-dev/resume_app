CREATE TYPE "public"."summary_source_type" AS ENUM('text', 'url', 'youtube');--> statement-breakpoint
CREATE TYPE "public"."summary_style_type" AS ENUM('bullet_points', 'short_paragraph', 'explain_like_five');--> statement-breakpoint
CREATE TABLE "summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_type" "summary_source_type" NOT NULL,
	"summary_style" "summary_style_type" NOT NULL,
	"original_source" text,
	"processed_text" text,
	"summary_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "summary" ADD CONSTRAINT "summary_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;