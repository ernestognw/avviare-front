import { gql } from '@apollo/client';

const GET_CONCEPTS_AVAILABLE = gql`
  query concepts($allotmentPrototype: QueryOperators) {
    concepts(allotmentPrototype: $allotmentPrototype) {
      results {
        id
        code
        name
        description
        subconcepts {
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
          }
        }
      }
    }
  }
`;

const CREATE_SUBCONCEPT_INSTANCE = gql`
  mutation createSubconceptInstance($subconceptInstance: SubconceptInstanceCreateInput!) {
    createSubconceptInstance(subconceptInstance: $subconceptInstance) {
      id
    }
  }
`;

export { CREATE_SUBCONCEPT_INSTANCE, GET_CONCEPTS_AVAILABLE };
