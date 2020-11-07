import { gql } from '@apollo/client';

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

export { UPDATE_USER, GET_USER };
