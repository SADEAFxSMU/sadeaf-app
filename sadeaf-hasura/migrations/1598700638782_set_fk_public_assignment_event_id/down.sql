alter table "public"."assignment" drop constraint "assignment_event_id_fkey",
          add constraint "assignment_event_id_fkey"
          foreign key ("event_id")
          references "public"."event"
          ("id")
          on update no action
          on delete no action;
