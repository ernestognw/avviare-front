import { gql } from '@apollo/client';

const GET_SUBCONCEPTS = gql`
  query subconcepts(
    $search: SubconceptSearchInput
    $params: QueryParams
    $concept: QueryOperators
  ) {
    subconcepts(search: $search, params: $params, concept: $concept) {
      info {
        count
      }
      results {
        id
        code
        name
        description
        quantity
        unit
        unitPrice
        subconceptInstancesCount
      }
    }
  }
`;

export { GET_SUBCONCEPTS };
