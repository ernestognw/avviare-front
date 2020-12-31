import { gql } from '@apollo/client';

// Used on edit allotment modal.
// Should fetch the same query so cache could allotment user withouth refetching the entire list
const allotmentInfo = `
  id
  number
  block {
    id
    number
  }
  allotmentPrototype {
    id 
    name
  }
  createdAt
  updatedAt
`;

const GET_ALLOTMENTS = gql`
  query allotments(
    $search: AllotmentSearchInput
    $params: QueryParams
    $development: QueryOperators
    $block: QueryOperators
    $allotmentPrototype: QueryOperators
  ) {
    allotments(search: $search, params: $params, development: $development, block: $block, allotmentPrototype: $allotmentPrototype) {
      info {
        count
      }
      results {
        ${allotmentInfo}
      }
    }
  }
`;

export { allotmentInfo, GET_ALLOTMENTS };
