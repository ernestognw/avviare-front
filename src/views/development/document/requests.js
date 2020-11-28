import { gql } from '@apollo/client';

const GET_DOCUMENT = gql`
  query document($id: ID!) {
    document(id: $id) {
      id
      name
      description
      categories
      versions {
        results {
          fileSource
          approvedBy {
            approvalDate
            user {
              id
              username
              firstName
              lastName
              profileImg
            }
          }
          createdAt
          id
          version
        }
      }
      lastVersion {
        id
        version
      }
    }
  }
`;

export { GET_DOCUMENT };
