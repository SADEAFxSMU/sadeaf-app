
ALTER TABLE "public"."notification_setting" ADD COLUMN "volunteer_urgent_assignment" boolean NULL;

ALTER TABLE "public"."notification_setting" ADD COLUMN "volunteer_new_assignment" boolean NULL;

ALTER TABLE "public"."notification_setting" ADD COLUMN "volunteer_periodic_assignment" boolean NULL;

ALTER TABLE "public"."notification_setting" ADD COLUMN "client_unmatched_assignment" boolean NULL;

ALTER TABLE "public"."notification_setting" ADD COLUMN "volunteer_matched_assignment" boolean NULL;

ALTER TABLE "public"."notification_setting" ADD COLUMN "client_matched_assignment" boolean NULL;

alter table "public"."notification_setting" rename column "volunteer_urgent_assignment" to "volunteer_urgent";

alter table "public"."notification_setting" rename column "volunteer_new_assignment" to "volunteer_new";

alter table "public"."notification_setting" rename column "volunteer_periodic_assignment" to "volunteer_periodic";

alter table "public"."notification_setting" rename column "client_unmatched_assignment" to "client_unmatched";

alter table "public"."notification_setting" rename column "volunteer_matched_assignment" to "volunteer_matched";

alter table "public"."notification_setting" rename column "client_matched_assignment" to "client_matched";

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_urgent" SET DEFAULT false;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_new" SET DEFAULT false;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_periodic" SET DEFAULT false;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "client_unmatched" SET DEFAULT false;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_matched" SET DEFAULT false;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "client_matched" SET DEFAULT false;

ALTER TABLE "public"."telegram_information" ADD COLUMN "user_handle" text NOT NULL UNIQUE;

ALTER TABLE "public"."telegram_information" ALTER COLUMN "chat_id" DROP NOT NULL;
