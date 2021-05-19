import { gql } from '@apollo/client';
import { creditInfo } from '../requests';

const GET_CREDIT = gql`
  query credit($id: ID!) {
    credit(id: $id) {
      id
      number
      bank
      type
      end
      TIIEDay
      billingDay
      paymentDay
      defaultInterestRate
      interestRate
      addTIIE
    }
  }
`;

const UPDATE_CREDIT = gql`
  mutation updateCredit($id: ID!, $credit: CreditUpdateInput!) {
    updateCredit(id: $id, credit: $credit) {
      ${creditInfo}
    }
  }
`;

export { GET_CREDIT, UPDATE_CREDIT };
