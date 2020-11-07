import { gql } from '@apollo/client';

const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      username
      firstName
      lastName
      profileImg
      email
      dateOfBirth
      overallRole
    }
  }
`;

export { GET_USER };
