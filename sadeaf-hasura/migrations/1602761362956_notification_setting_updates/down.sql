
ALTER TABLE "public"."telegram_information" ADD CONSTRAINT "telegram_information_user_handle_key" UNIQUE ("user_handle");

ALTER TABLE "public"."email_information" ADD COLUMN "email_address" varchar;
ALTER TABLE "public"."email_information" ALTER COLUMN "email_address" DROP NOT NULL;
