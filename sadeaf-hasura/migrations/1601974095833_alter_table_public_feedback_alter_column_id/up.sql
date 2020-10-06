ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_id_key" UNIQUE ("id");
COMMENT ON COLUMN "public"."feedback"."id" IS E'Current feedback id value before inserting / updating feedback manually. Id takes into account previous feedback\'s that have been added and increments it by 1.';
