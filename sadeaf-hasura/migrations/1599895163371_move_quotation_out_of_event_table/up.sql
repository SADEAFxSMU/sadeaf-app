
CREATE TABLE "public"."quotation"("id" INTEGER NOT NULL DEFAULT nextval('account_id_seq'::regclass), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "requestor_type" text NOT NULL, "first_block_duration_m" integer NOT NULL DEFAULT 120, "subsequent_block_duration_m" integer NOT NULL DEFAULT 30, "fee_for_first_block" numeric NOT NULL, "fee_per_subsequent_block" numeric NOT NULL, PRIMARY KEY ("id") , UNIQUE ("requestor_type")); COMMENT ON TABLE "public"."quotation" IS E'Reference - https://sadeaf.org.sg/service/notetaking/';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_quotation_updated_at"
BEFORE UPDATE ON "public"."quotation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_quotation_updated_at" ON "public"."quotation"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."event" DROP COLUMN "quotation" CASCADE;

ALTER TABLE "public"."client" ADD COLUMN "quotation_id" integer NULL;

alter table "public"."client"
           add constraint "client_quotation_id_fkey"
           foreign key ("quotation_id")
           references "public"."quotation"
           ("id") on update restrict on delete restrict;
