
ALTER TABLE "public"."volunteer_assignment_opt_in" ADD COLUMN "status" text NOT NULL DEFAULT 'pending';

ALTER TABLE ONLY "public"."volunteer_assignment_opt_in" ALTER COLUMN "status" SET DEFAULT 'OPTED_IN';
