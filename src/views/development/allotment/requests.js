import { gql } from '@apollo/client';

const GET_ALLOTMENT = gql`
  query allotment($id: ID!) {
    allotment(id: $id) {
      id
      number
      allotmentPrototype {
        id
      }
    }
  }
`;

const GET_CONCEPTS = gql`
  query concepts($search: ConceptSearchInput, $params: QueryParams, $allotment: QueryOperators!) {
    concepts(search: $search, params: $params, allotment: $allotment) {
      info {
        count
      }
      results {
        id
        code
        name
        description
        progress(allotment: $allotment)
        subconceptInstances(allotment: $allotment) {
          info {
            count
          }
          results {
            id
            subconcept {
              id
            }
          }
        }
      }
    }
  }
`;

export { GET_ALLOTMENT, GET_CONCEPTS };
