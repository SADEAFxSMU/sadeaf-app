
alter table "public"."blacklist" drop constraint "blacklist_client_account_id_volunteer_account_id_key";

alter table "public"."blacklist" drop constraint "blacklist_volunteer_account_id_fkey",
          add constraint "blacklist_volunteer_id_fkey"
          foreign key ("volunteer_account_id")
          references "public"."volunteer"
          ("id")
          on update restrict
          on delete restrict;

alter table "public"."blacklist" drop constraint "blacklist_client_account_id_fkey",
          add constraint "blacklist_client_id_fkey"
          foreign key ("client_account_id")
          references "public"."client"
          ("id")
          on update restrict
          on delete restrict;

alter table "public"."blacklist" rename column "volunteer_account_id" to "volunteer_id";

alter table "public"."blacklist" rename column "client_account_id" to "client_id";

ALTER TABLE "public"."feedback" DROP CONSTRAINT "feedback_id_key";
COMMENT ON COLUMN "public"."feedback"."id" IS E'';

ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_id_key" UNIQUE ("id");

ALTER TABLE "public"."feedback" DROP CONSTRAINT "feedback_id_key";
