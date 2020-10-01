
ALTER TABLE "public"."account" ADD COLUMN "password" varchar;
ALTER TABLE "public"."account" ALTER COLUMN "password" DROP NOT NULL;

ALTER TABLE "public"."account" ADD COLUMN "username" varchar;
ALTER TABLE "public"."account" ALTER COLUMN "username" DROP NOT NULL;
ALTER TABLE "public"."account" ADD CONSTRAINT account_username_key UNIQUE (username);
