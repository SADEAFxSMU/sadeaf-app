# Setting up Hasura in a DEV environment
Make sure you have docker installed locally.

1. Install dependencies with `yarn workspace sadeaf-hasura install`
2. Run `docker-compose up -d` to start the Hasura GraphQL engine and the psql db
3. Run `yarn workspace sadeaf-hasura hasura-console`
4. The Hasura console will automatically pop up in your default browser

> Make sure that the graphql engine has actually started before running step 2. If this is a fresh start, it
might take a while. 

# How it works
- The files in `hasura-data/metadata` are used by Hasura to track the state of all tables in the psql db. It is also what 
Hasura uses to infer relationships between tables (eg. Client is a child of Account)
- The files in `hasura-data/migrations` are used by Hasura to track the psql db migrations made from the console

# Making changes
Remember to commit any schema or metadata changes.
### Schema changes
- Make psql db changes on the Hasura console
- The migration will automatically appear in `hasura-data/migration`

### Metadata changes
- Tracking anything new will automatically update the files in `hasura-data/metadata`
