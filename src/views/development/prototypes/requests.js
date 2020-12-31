import { gql } from '@apollo/client';

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
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

export { GET_PROTOTYPES };
