import { gql } from '@apollo/client';

const CREATE_CONCEPT = gql`
  mutation createConcept($concept: ConceptCreateInput!) {
    createConcept(concept: $concept) {
      id
    }
  }
`;

export { CREATE_CONCEPT };
