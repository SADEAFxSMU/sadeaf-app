alter table "public"."event" drop constraint "event_client_id_fkey",
          add constraint "event_client_id_fkey"
          foreign key ("client_id")
          references "public"."client"
          ("id")
          on update no action
          on delete no action;
