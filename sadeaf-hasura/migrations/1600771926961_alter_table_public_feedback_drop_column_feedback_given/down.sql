ALTER TABLE "public"."feedback" ADD COLUMN "feedback_given" int;
ALTER TABLE "public"."feedback" ALTER COLUMN "feedback_given" DROP NOT NULL;
ALTER TABLE "public"."feedback" ALTER COLUMN "feedback_given" SET DEFAULT 0;
