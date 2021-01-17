import { gql } from '@apollo/client';

const CREATE_ALLOTMENT = gql`
  mutation createAllotment($allotment: AllotmentCreateInput!, $subconcepts: [ID]!) {
    createAllotment(allotment: $allotment, subconcepts: $subconcepts) {
      id
    }
  }
`;

export { CREATE_ALLOTMENT };
