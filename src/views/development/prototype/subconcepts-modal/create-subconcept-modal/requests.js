import { gql } from '@apollo/client';

const CREATE_SUBCONCEPT = gql`
  mutation createSubconcept($subconcept: SubconceptCreateInput!) {
    createSubconcept(subconcept: $subconcept) {
      id
    }
  }
`;

export { CREATE_SUBCONCEPT };
