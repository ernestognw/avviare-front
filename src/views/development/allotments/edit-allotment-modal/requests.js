import { gql } from '@apollo/client';
import { allotmentInfo } from '../requests';

const GET_ALLOTMENT = gql`
  query allotment($id: ID!) {
    allotment(id: $id) {
      id
      number
      allotmentPrototype {
        id
      }
      block {
        id
      }
    }
  }
`;

const UPDATE_ALLOTMENT = gql`
  mutation updateAllotment($id: ID!, $allotment: AllotmentUpdateInput!) {
    updateAllotment(id: $id, allotment: $allotment){
      ${allotmentInfo}
    }
  }
`;

export { GET_ALLOTMENT, UPDATE_ALLOTMENT };
