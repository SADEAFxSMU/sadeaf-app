#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE sadeaf_worker;
    GRANT ALL PRIVILEGES ON DATABASE sadeaf_worker TO "$POSTGRES_USER";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "sadeaf_worker" <<-EOSQL
    CREATE EXTENSION pgcrypto;
EOSQL
