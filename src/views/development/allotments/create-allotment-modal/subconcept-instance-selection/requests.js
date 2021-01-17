import { gql } from '@apollo/client';

const GET_AVAILABLE_CONCEPTS = gql`
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

export { GET_AVAILABLE_CONCEPTS };
