import { gql } from '@apollo/client';

const GET_DOCUMENTS = gql`
  query documents($development: QueryField!) {
    documents(development: $development) {
      results {
        id
        name
        lastVersion {
          id
          fileSource
        }
        name
        finalVersion {
          id
          fileSource
        }
      }
    }
  }
`;

export { GET_DOCUMENTS };
