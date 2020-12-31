import { gql } from '@apollo/client';

const CREATE_ALLOTMENT = gql`
  mutation createAllotment($allotment: AllotmentCreateInput!) {
    createAllotment(allotment: $allotment) {
      id
    }
  }
`;

export { CREATE_ALLOTMENT };
