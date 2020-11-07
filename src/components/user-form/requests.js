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

export { EMAIL_EXISTS, USERNAME_EXISTS };
