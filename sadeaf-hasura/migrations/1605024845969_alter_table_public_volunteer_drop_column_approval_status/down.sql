ALTER TABLE "public"."volunteer" ADD COLUMN "approval_status" bool;
ALTER TABLE "public"."volunteer" ALTER COLUMN "approval_status" DROP NOT NULL;
ALTER TABLE "public"."volunteer" ALTER COLUMN "approval_status" SET DEFAULT false;
