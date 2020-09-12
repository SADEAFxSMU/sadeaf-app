
alter table "public"."client" drop constraint "client_quotation_id_fkey";

ALTER TABLE "public"."client" DROP COLUMN "quotation_id";

ALTER TABLE "public"."event" ADD COLUMN "quotation" numeric;
ALTER TABLE "public"."event" ALTER COLUMN "quotation" DROP NOT NULL;

DROP TABLE "public"."quotation";
