alter table "public"."blacklist" drop constraint "blacklist_client_id_fkey",
             add constraint "blacklist_client_account_id_fkey"
             foreign key ("client_account_id")
             references "public"."client"
             ("account_id") on update restrict on delete restrict;
