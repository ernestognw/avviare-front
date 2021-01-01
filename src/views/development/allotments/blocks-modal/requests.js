import { gql } from '@apollo/client';

// Used on edit block modal.
// Should fetch the same query so cache could block user withouth refetching the entire list
const blockInfo = `
  id
  number
  createdAt
  updatedAt
  allotmentsCount
`;

const GET_BLOCKS = gql`
  query blocks($search: BlockSearchInput, $params: QueryParams, $development: QueryOperators) {
    blocks(search: $search, params: $params, development: $development) {
      info {
        count
      }
      results {
        ${blockInfo}
      }
    }
  }
`;

export { blockInfo, GET_BLOCKS };
