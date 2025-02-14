# Setting up Hasura in a DEV environment

0. `cd sadeaf-hasura`
1. Install [docker](https://docs.docker.com/get-docker/) & [docker-compose](https://docs.docker.com/compose/)
2. Install dependencies with `yarn install`
3. Run `yarn run console`
4. The Hasura console will automatically pop up in your default browser

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

### Squashing Migrations
- Squash migrations before committing
  ```
  yarn run squash-migrations --from "<timestamp>" --name "<name>"
  ```
- Example: `yarn run squash-migrations --from 1598941155670 --name "notification_setting_updates"`
