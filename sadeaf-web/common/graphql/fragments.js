import gql from 'graphql-tag';

export const accountFieldsFragment = gql`
  fragment accountFields on account {
    id
    name
    email
    role
    profile_pic_url
    contact
    created_at
    updated_at
  }
`;

export const accountFieldsWithRolesFragment = gql`
  fragment accountFieldsWithRoles on account {
    ...accountFields
    client { id }
    volunteer { id }
    service_requestor { id }
  }
  ${accountFieldsFragment}
`
