
ALTER TABLE ONLY "public"."volunteer_assignment_opt_in" ALTER COLUMN "status" SET DEFAULT ''pending'::text';

ALTER TABLE "public"."volunteer_assignment_opt_in" DROP COLUMN "status";
