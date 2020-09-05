# Graphql Query Builder

A CLI tool that performs GraphQL introspection and combines the 
results with Hasura's Role-based permission configs to build GraphQL 
queries and mutations (CRUD).

## Example use
`yarn run graphql-codegen`

```
Performing GraphQL + Hasura Roles introspection...
? Select schema: assignment
? Select user role: client
? Select operations: select
? Select Query fields: address_line_one, address_line_two, end_dt, event_id, id, latitude, lo
ngitude, postal, room_number, start_dt, status, volunteer_id
---------- select ----------
query QueryAssignment {
  assignment {
    address_line_one
    address_line_two
    end_dt
    event_id
    id
    latitude
    longitude
    postal
    room_number
    start_dt
    status
    volunteer_id
  }
}

```
