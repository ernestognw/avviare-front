import { gql } from '@apollo/client';

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
        id
        code
        name
        description
        subconceptsCount
      }
    }
  }
`;

export { GET_ALLOTMENT_PROTOTYPE, GET_CONCEPTS };
