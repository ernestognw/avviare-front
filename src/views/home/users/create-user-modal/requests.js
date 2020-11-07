import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation createUser($user: UserCreateInput!) {
    createUser(user: $user) {
      id
    }
  }
`;

export { CREATE_USER };
