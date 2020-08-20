FROM hasura/graphql-engine:v1.3.0.cli-migrations-v2

EXPOSE 8080

ENV HASURA_GRAPHQL_ENABLE_CONSOLE "false"

ADD ./metadata /hasura-metadata
ADD ./migrations /hasura-migrations
