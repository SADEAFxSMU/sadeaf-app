FROM hasura/graphql-engine:v1.3.0.cli-migrations-v2

EXPOSE 8080

ENV HASURA_GRAPHQL_ENABLE_CONSOLE "false"
ENV HASURA_GRAPHQL_DEV_MODE "false"
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "anonymous"
ENV WEB_HOOK_URL "http://localhost:4000"

ADD ./metadata /hasura-metadata
ADD ./migrations /hasura-migrations
