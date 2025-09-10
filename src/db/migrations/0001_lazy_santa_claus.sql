CREATE TABLE "refresh_token" (
	"token" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"expired_at" timestamp NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "chirps" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chirps" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "chirps" ADD COLUMN "body" varchar(141) NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chirps" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "chirps" DROP COLUMN "expired_at";--> statement-breakpoint
ALTER TABLE "chirps" DROP COLUMN "revoked_at";