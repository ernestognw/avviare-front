import { gql } from '@apollo/client';
import { subconceptInfo } from '../requests';

const GET_SUBCONCEPT = gql`
  query subconcept($id: ID!) {
    subconcept(id: $id) {
      id
      code
      name
      description
      quantity
      unit
      unitPrice
    }
  }
`;

const UPDATE_SUBCONCEPT = gql`
  mutation updateSubconcept($id: ID!, $subconcept: SubconceptUpdateInput!) {
    updateSubconcept(id: $id, subconcept: $subconcept){
      ${subconceptInfo}
    }
  }
`;

export { GET_SUBCONCEPT, UPDATE_SUBCONCEPT };
