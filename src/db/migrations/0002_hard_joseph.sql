ALTER TABLE "refresh_token" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_token" ADD COLUMN "expires_at" timestamp DEFAULT now() + interval '60 days' NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_token" DROP COLUMN "expired_at";