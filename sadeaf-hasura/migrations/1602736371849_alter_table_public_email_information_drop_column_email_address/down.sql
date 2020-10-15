ALTER TABLE "public"."email_information" ADD COLUMN "email_address" varchar;
ALTER TABLE "public"."email_information" ALTER COLUMN "email_address" DROP NOT NULL;
