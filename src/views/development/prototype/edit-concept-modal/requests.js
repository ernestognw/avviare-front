import { gql } from '@apollo/client';
import { conceptInfo } from '../requests';

const GET_CONCEPT = gql`
  query concept($id: ID!) {
    concept(id: $id) {
      id
      code
      name
      description
    }
  }
`;

const UPDATE_CONCEPT = gql`
  mutation updateConcept($id: ID!, $concept: ConceptUpdateInput!) {
    updateConcept(id: $id, concept: $concept){
      ${conceptInfo}
    }
  }
`;

export { GET_CONCEPT, UPDATE_CONCEPT };
