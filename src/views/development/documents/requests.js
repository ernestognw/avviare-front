import { gql } from '@apollo/client';

// Used on edit document modal.
// Should fetch the same query so cache could document user withouth refetching the entire list
const documentInfo = `
  id
  name
  description
  categories
  versions {
    info {
      count
    }
  }
  finalVersion {
    id
    version
    fileSource
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
  lastVersion {
    id
    version
    fileSource
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
`;

const GET_DOCUMENTS = gql`
  query documents(
    $search: DocumentSearchInput
    $params: QueryParams!
    $development: QueryOperators!
    $categories: QueryOperators
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
       ${documentInfo}
      }
    }
  }
`;

export { documentInfo, GET_DOCUMENTS };
