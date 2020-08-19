FROM hasura/graphql-engine:v1.3.0.cli-migrations-v2

EXPOSE 8080

ADD ./migrations /hasura-migrations
ADD ./metadata /hasura-metadata

ENV HASURA_GRAPHQL_ENABLE_CONSOLE "false"
