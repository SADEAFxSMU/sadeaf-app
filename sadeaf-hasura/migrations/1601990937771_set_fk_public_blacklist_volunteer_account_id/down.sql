alter table "public"."blacklist" drop constraint "blacklist_volunteer_account_id_fkey",
          add constraint "blacklist_volunteer_id_fkey"
          foreign key ("volunteer_account_id")
          references "public"."volunteer"
          ("id")
          on update restrict
          on delete restrict;
