import { gql } from '@apollo/client';

const GET_CREDIT = gql`
  query credit($id: ID!) {
    credit(id: $id) {
      id
      number
    }
  }
`;

export { GET_CREDIT };
