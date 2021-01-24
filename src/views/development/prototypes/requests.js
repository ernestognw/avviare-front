import { gql } from '@apollo/client';

// Used on edit allotment prototype modal.
// Should fetch the same query so cache could allotment prototype user withouth refetching the entire list
const allotmentPrototypeInfo = `
  id
  name
  progress
  createdAt
  updatedAt
`;

const GET_PROTOTYPES = gql`
  query allotmentPrototypes(
    $search: AllotmentPrototypeSearchInput
    $params: QueryParams
    $development: QueryOperators
  ) {
    allotmentPrototypes(search: $search, params: $params, development: $development) {
      info {
        count
      }
      results {
        ${allotmentPrototypeInfo}
      }
    }
  }
`;

export { allotmentPrototypeInfo, GET_PROTOTYPES };
