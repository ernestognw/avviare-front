import { gql } from '@apollo/client';

const GET_BLOCKS = gql`
  query blocks($search: BlockSearchInput, $params: QueryParams, $development: QueryOperators) {
    blocks(search: $search, params: $params, development: $development) {
      results {
        id
        number
      }
    }
  }
`;

const GET_ALLOTMENT_PROTOTYPES = gql`
  query allotmentPrototypes(
    $search: AllotmentPrototypeSearchInput
    $params: QueryParams
    $development: QueryOperators
  ) {
    allotmentPrototypes(search: $search, params: $params, development: $development) {
      results {
        id
        name
      }
    }
  }
`;

export { GET_BLOCKS, GET_ALLOTMENT_PROTOTYPES };
