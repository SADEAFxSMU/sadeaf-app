# SADEAF WEB

> SADEAF Management System Web App

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# test project
$ yarn test
```

## IDEA setup
> Setup to enable linting and autocomplete for GraphQL queries to Hasura, using the IDEA `JS Graphql` plugin
1. Install `JS GraphQL` plugin under Plugins > Marketplace
2. Click on the GraphQL plugin tab (or Cmd + Shift + A "graphql")
3. Click plus button and select sadeaf-web/ to create a .graphqlconfig (json) file
4. Open the `.graphqlconfig` file and set the endpoint to `http://localhost:8080/v1/grapqhl`
5. Click the run button next to the line number where the endpoint is located. A `schema.graphql` file is generated.
6. **DO NOT check any of the generated files into version control.**

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
