
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_id_key" UNIQUE ("id");

ALTER TABLE "public"."feedback" DROP CONSTRAINT "feedback_id_key";

ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_id_key" UNIQUE ("id");
COMMENT ON COLUMN "public"."feedback"."id" IS E'Check feedback id value before inserting / updating feedback manually. It takes into account previous feedback\'s that have been added and increments it by 1.';

alter table "public"."blacklist" rename column "client_id" to "client_account_id";

alter table "public"."blacklist" rename column "volunteer_id" to "volunteer_account_id";

alter table "public"."blacklist" drop constraint "blacklist_client_id_fkey",
             add constraint "blacklist_client_account_id_fkey"
             foreign key ("client_account_id")
             references "public"."client"
             ("account_id") on update restrict on delete restrict;

alter table "public"."blacklist" drop constraint "blacklist_volunteer_id_fkey",
             add constraint "blacklist_volunteer_account_id_fkey"
             foreign key ("volunteer_account_id")
             references "public"."volunteer"
             ("account_id") on update restrict on delete restrict;

alter table "public"."blacklist" add constraint "blacklist_client_account_id_volunteer_account_id_key" unique ("client_account_id", "volunteer_account_id");
