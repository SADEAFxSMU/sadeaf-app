
ALTER TABLE "public"."telegram_information" ALTER COLUMN "chat_id" SET NOT NULL;

ALTER TABLE "public"."telegram_information" DROP COLUMN "user_handle";

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "client_matched" DROP DEFAULT;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_matched" DROP DEFAULT;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "client_unmatched" DROP DEFAULT;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_periodic" DROP DEFAULT;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_new" DROP DEFAULT;

ALTER TABLE ONLY "public"."notification_setting" ALTER COLUMN "volunteer_urgent" DROP DEFAULT;

alter table "public"."notification_setting" rename column "client_matched" to "client_matched_assignment";

alter table "public"."notification_setting" rename column "volunteer_matched" to "volunteer_matched_assignment";

alter table "public"."notification_setting" rename column "client_unmatched" to "client_unmatched_assignment";

alter table "public"."notification_setting" rename column "volunteer_periodic" to "volunteer_periodic_assignment";

alter table "public"."notification_setting" rename column "volunteer_new" to "volunteer_new_assignment";

alter table "public"."notification_setting" rename column "volunteer_urgent" to "volunteer_urgent_assignment";

ALTER TABLE "public"."notification_setting" DROP COLUMN "client_matched_assignment";

ALTER TABLE "public"."notification_setting" DROP COLUMN "volunteer_matched_assignment";

ALTER TABLE "public"."notification_setting" DROP COLUMN "client_unmatched_assignment";

ALTER TABLE "public"."notification_setting" DROP COLUMN "volunteer_periodic_assignment";

ALTER TABLE "public"."notification_setting" DROP COLUMN "volunteer_new_assignment";

ALTER TABLE "public"."notification_setting" DROP COLUMN "volunteer_urgent_assignment";
