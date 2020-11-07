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

const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $user: UserUpdateInput!) {
    updateUser(id: $id, user: $user) {
      id
    }
  }
`;

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      username
      firstName
      lastName
      profileImg
      email
      dateOfBirth
      profileImg
      overallRole
    }
  }
`;

export { EMAIL_EXISTS, USERNAME_EXISTS, UPDATE_USER, GET_USER };
