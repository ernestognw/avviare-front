import { gql } from '@apollo/client';

const UPDATE_USER = gql`
  mutation updateUserByToken($user: UserUpdateInput!) {
    updateUserByToken(user: $user) {
      id
    }
  }
`;

export { UPDATE_USER };
