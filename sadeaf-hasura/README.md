# Setting up Hasura in a DEV environment
Make sure you have docker installed locally.

1. Install dependencies with `yarn install`
2. Run `yarn workspace sadeaf-hasura console`
3. The Hasura console will automatically pop up in your default browser

> If this is a fresh build, step 2 will fail with an error like `FATA[0002] version check: failed to get version from server: failed making version api call`. Just make sure the containers are up then run the command again. 

# How it works
- The files in `/metadata` are used by Hasura to track the state of all tables in the psql db. It is also what 
Hasura uses to infer relationships between tables (eg. Client is a child of Account)
- The files in `/migrations` are used by Hasura to track the psql db migrations made from the console

# Making changes
Remember to commit any schema or metadata changes.
### Schema changes
- Make psql db changes on the Hasura console
- The migration will automatically appear in `/migration`

### Metadata changes
- Tracking anything new will automatically update the files in `/metadata`
