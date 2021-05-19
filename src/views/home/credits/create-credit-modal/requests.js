import { gql } from '@apollo/client';

const CREATE_CREDIT = gql`
  mutation createCredit($credit: CreditCreateInput!) {
    createCredit(credit: $credit) {
      id
    }
  }
`;

export { CREATE_CREDIT };
