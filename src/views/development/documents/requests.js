import { gql } from '@apollo/client';

const GET_DOCUMENTS = gql`
  query documents(
    $search: DocumentSearchInput
    $params: QueryParams!
    $development: QueryField!
    $categories: QueryField
    $sortBy: DocumentSortInput
  ) {
    documents(
      search: $search
      params: $params
      development: $development
      categories: $categories
      sortBy: $sortBy
    ) {
      info {
        count
      }
      results {
        id
        name
        description
        categories
        versions {
          info {
            count
          }
        }
        lastVersion {
          approvedBy {
            user {
              id
              firstName
              lastName
              profileImg
            }
            approvalDate
          }
        }
      }
    }
  }
`;

export { GET_DOCUMENTS };
