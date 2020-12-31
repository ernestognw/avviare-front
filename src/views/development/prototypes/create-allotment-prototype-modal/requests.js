import { gql } from '@apollo/client';

const CREATE_ALLOTMENT_PROTOTYPE = gql`
  mutation createAllotmentPrototype($allotmentPrototype: AllotmentPrototypeCreateInput!) {
    createAllotmentPrototype(allotmentPrototype: $allotmentPrototype) {
      id
    }
  }
`;

export { CREATE_ALLOTMENT_PROTOTYPE };
