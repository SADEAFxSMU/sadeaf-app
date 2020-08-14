# Setting up Hasura in a DEV environment
Make sure you have docker installed locally.

- Run `docker-compose -f dev-docker-compose.yaml up -d` to start the Hasura GraphQL engine and 
the psql db

# How it works
- The `schema.sql` in `setup-scripts` is ran when initialising the psql db
- The files in `metadata` are used by Hasura to track the state of all tables in the psql db. It is also what 
Hasura uses to infer relationships between tables (eg. Client is a child of Account)

# Making changes to the schema locally
- Make your schema changes in `setup-scripts/schema.sql`
- Comment out the metadata volume under the `graphql-engine` service in `dev-docker-compose.yaml`
- __Down__ the containers, then `up` them again
- Go to the Hasura web GUI and track all tables and foreign key relationships
- Run `setup-scripts/get_metadata.sh --setup`. This copies the new metadata information into `metadata`
- Uncomment the metadata volume in the compose file, then up the services

# Notes
- You always need to __down__ the psql db container if you want your changes in the schema file to take effect
