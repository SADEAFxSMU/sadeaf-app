# SADEAF Authorization Design

[Hasura permission-rules](https://hasura.io/docs/1.0/graphql/core/auth/authorization/permission-rules.html)

##  Using account tables
You can use the _exists operator to set a permission rule based on tables/views that are 
not related to our table.

For example, say we want to allow a user to insert an event only if the value of the 
type column in the account table is set to 'true'. Let’s assume the account’s username 
is passed in the X-Hasura-User-ID session variable.
