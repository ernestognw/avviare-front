import { gql } from '@apollo/client';
import { allotmentPrototypeInfo } from '../requests';

const GET_ALLOTMENT_PROTOTYPE = gql`
  query allotmentPrototype($id: ID!) {
    allotmentPrototype(id: $id) {
      id
      name
    }
  }
`;

const UPDATE_ALLOTMENT_PROTOTYPE = gql`
  mutation updateAllotmentPrototype($id: ID!, $allotmentPrototype: AllotmentPrototypeUpdateInput!) {
    updateAllotmentPrototype(id: $id, allotmentPrototype: $allotmentPrototype){
      ${allotmentPrototypeInfo}
    }
  }
`;

export { GET_ALLOTMENT_PROTOTYPE, UPDATE_ALLOTMENT_PROTOTYPE };
