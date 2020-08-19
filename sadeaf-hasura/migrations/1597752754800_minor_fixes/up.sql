
ALTER TABLE "public"."assignment" DROP COLUMN "attendance_id" CASCADE;

ALTER TABLE "public"."attendance" ADD COLUMN "assignment_id" integer NOT NULL UNIQUE;

alter table "public"."attendance"
           add constraint "attendance_assignment_id_fkey"
           foreign key ("assignment_id")
           references "public"."assignment"
           ("id") on update restrict on delete restrict;

ALTER TABLE "public"."feedback" DROP COLUMN "assignment_id" CASCADE;

ALTER TABLE "public"."feedback" DROP COLUMN "client_id" CASCADE;

ALTER TABLE "public"."feedback" ADD COLUMN "event_id" integer NULL;

ALTER TABLE "public"."feedback" ALTER COLUMN "event_id" SET NOT NULL;

ALTER TABLE "public"."feedback" ADD COLUMN "volunteer_id" integer NOT NULL;

alter table "public"."feedback"
           add constraint "feedback_event_id_fkey"
           foreign key ("event_id")
           references "public"."event"
           ("id") on update restrict on delete restrict;

alter table "public"."feedback"
           add constraint "feedback_volunteer_id_fkey"
           foreign key ("volunteer_id")
           references "public"."volunteer"
           ("id") on update restrict on delete restrict;

alter table "public"."feedback" add constraint "feedback_event_id_volunteer_id_key" unique ("event_id", "volunteer_id");

ALTER TABLE "public"."account" ADD COLUMN "role" varchar NOT NULL;
