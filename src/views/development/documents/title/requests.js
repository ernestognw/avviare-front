import { gql } from '@apollo/client';

const GET_DOCUMENTS = gql`
  query documents($development: QueryOperators!) {
    documents(development: $development) {
      results {
        id
        name
        lastVersion {
          id
          fileSource
          createdAt
          version
        }
        name
        finalVersion {
          id
          fileSource
          createdAt
          version
        }
      }
    }
  }
`;

export { GET_DOCUMENTS };
