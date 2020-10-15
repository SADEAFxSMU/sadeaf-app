
ALTER TABLE "public"."email_information" DROP COLUMN "email_address" CASCADE;

ALTER TABLE "public"."telegram_information" DROP CONSTRAINT "telegram_information_user_handle_key";
