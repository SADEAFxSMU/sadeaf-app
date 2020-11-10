

ALTER TABLE "public"."event" ADD COLUMN "notetaking_assignment" boolean NOT NULL DEFAULT False;

ALTER TABLE "public"."event" ADD COLUMN "interpretation_flag" boolean NULL DEFAULT False;

alter table "public"."event" rename column "notetaking_assignment" to "notetaking_flag";

ALTER TABLE "public"."volunteer" ADD COLUMN "notetaking_flag" boolean NULL DEFAULT False;

ALTER TABLE "public"."volunteer" ADD COLUMN "interpretation_flag" boolean NOT NULL DEFAULT False;

ALTER TABLE "public"."volunteer" ALTER COLUMN "notetaking_flag" SET NOT NULL;

alter table "public"."volunteer" rename column "notetaking_flag" to "notetaker";

alter table "public"."volunteer" rename column "interpretation_flag" to "interpreter";

alter table "public"."event" rename column "notetaking_flag" to "notetaker_required";

alter table "public"."event" rename column "interpretation_flag" to "interpreter_required";
