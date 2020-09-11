FROM hasura/graphql-engine:v1.3.0.cli-migrations-v2

EXPOSE 8080

ENV HASURA_GRAPHQL_ENABLE_CONSOLE "false"
ENV WEB_HOOK_URL "http://localhost:3000"

ADD ./metadata /hasura-metadata
ADD ./migrations /hasura-migrations
