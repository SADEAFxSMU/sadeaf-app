
ALTER TABLE "public"."volunteer" ALTER COLUMN "notetaking_flag" DROP NOT NULL;

ALTER TABLE "public"."volunteer" DROP COLUMN "interpretation_flag";

ALTER TABLE "public"."volunteer" DROP COLUMN "notetaking_flag";

alter table "public"."event" rename column "notetaking_flag" to "notetaking_assignment";

ALTER TABLE "public"."event" DROP COLUMN "interpretation_flag";

ALTER TABLE "public"."event" DROP COLUMN "notetaking_assignment";
