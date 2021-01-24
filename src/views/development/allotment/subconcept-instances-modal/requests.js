import { gql } from '@apollo/client';

const GET_SUBCONCEPT_INSTANCES = gql`
  query subconceptInstances(
    $params: QueryParams
    $concept: QueryOperators
    $allotment: QueryOperators
  ) {
    subconceptInstances(params: $params, concept: $concept, allotment: $allotment) {
      info {
        count
      }
      results {
        id
        progress
        subconcept {
          id
          code
          name
          description
          quantity
          unit
          unitPrice
        }
      }
    }
  }
`;

export { GET_SUBCONCEPT_INSTANCES };
