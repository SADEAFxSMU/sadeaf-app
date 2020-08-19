
ALTER TABLE "public"."account" DROP COLUMN "role";

alter table "public"."feedback" drop constraint "feedback_event_id_volunteer_id_key";

alter table "public"."feedback" drop constraint "feedback_volunteer_id_fkey";

alter table "public"."feedback" drop constraint "feedback_event_id_fkey";

ALTER TABLE "public"."feedback" DROP COLUMN "volunteer_id";

ALTER TABLE "public"."feedback" ALTER COLUMN "event_id" DROP NOT NULL;

ALTER TABLE "public"."feedback" DROP COLUMN "event_id";

ALTER TABLE "public"."feedback" ADD COLUMN "client_id" int4;
ALTER TABLE "public"."feedback" ALTER COLUMN "client_id" DROP NOT NULL;
ALTER TABLE "public"."feedback" ADD CONSTRAINT feedback_client_id_fkey FOREIGN KEY (client_id) REFERENCES "public"."client" (id) ON DELETE no action ON UPDATE no action;

ALTER TABLE "public"."feedback" ADD COLUMN "assignment_id" int4;
ALTER TABLE "public"."feedback" ALTER COLUMN "assignment_id" DROP NOT NULL;
ALTER TABLE "public"."feedback" ADD CONSTRAINT feedback_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES "public"."assignment" (id) ON DELETE no action ON UPDATE no action;
ALTER TABLE "public"."feedback" ADD CONSTRAINT feedback_assignment_id_key UNIQUE (assignment_id);

alter table "public"."attendance" drop constraint "attendance_assignment_id_fkey";

ALTER TABLE "public"."attendance" DROP COLUMN "assignment_id";

ALTER TABLE "public"."assignment" ADD COLUMN "attendance_id" int4;
ALTER TABLE "public"."assignment" ALTER COLUMN "attendance_id" DROP NOT NULL;
ALTER TABLE "public"."assignment" ADD CONSTRAINT assignment_attendance_id_fkey FOREIGN KEY (attendance_id) REFERENCES "public"."attendance" (id) ON DELETE no action ON UPDATE no action;
