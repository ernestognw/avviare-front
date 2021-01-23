import { gql } from '@apollo/client';

// Used on edit concept modal.
// Should fetch the same query so cache could concept user withouth refetching the entire list
const conceptInfo = `
  id
  code
  name
  description
  subconcepts {
    info {
      count
    }
  }
`;

const GET_ALLOTMENT_PROTOTYPE = gql`
  query allotmentPrototype($id: ID!) {
    allotmentPrototype(id: $id) {
      id
      name
    }
  }
`;

const GET_CONCEPTS = gql`
  query concepts(
    $search: ConceptSearchInput
    $params: QueryParams
    $allotmentPrototype: QueryOperators
  ) {
    concepts(search: $search, params: $params, allotmentPrototype: $allotmentPrototype) {
      info {
        count
      }
      results {
        ${conceptInfo}
      }
    }
  }
`;

export { conceptInfo, GET_ALLOTMENT_PROTOTYPE, GET_CONCEPTS };
