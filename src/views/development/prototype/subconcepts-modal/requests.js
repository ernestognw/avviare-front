import { gql } from '@apollo/client';

// Used on edit subconcept modal.
// Should fetch the same query so cache could subconcept user withouth refetching the entire list
const subconceptInfo = `
  id
  code
  name
  description
  quantity
  unit
  unitPrice
  subconceptInstancesCount
`;

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
        ${subconceptInfo}
      }
    }
  }
`;

export { subconceptInfo, GET_SUBCONCEPTS };
