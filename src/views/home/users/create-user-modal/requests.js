import { gql } from '@apollo/client';

const EMAIL_EXISTS = gql`
  query userEmailExists($email: String!) {
    userEmailExists(email: $email)
  }
`;

const USERNAME_EXISTS = gql`
  query usernameExists($username: String!) {
    usernameExists(username: $username)
  }
`;

const CREATE_USER = gql`
  mutation createUser($user: UserCreateInput!) {
    createUser(user: $user) {
      id
    }
  }
`;

export { EMAIL_EXISTS, USERNAME_EXISTS, CREATE_USER };
