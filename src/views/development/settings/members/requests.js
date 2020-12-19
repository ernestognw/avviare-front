import { gql } from '@apollo/client';

const GET_MEMBERS = gql`
  query users($worksAt: QueryOperators, $search: UserSearchInput, $params: QueryParams) {
    users(worksAt: $worksAt, search: $search, params: $params) {
      info {
        count
        pages
      }
      results {
        id
        username
        firstName
        lastName
        profileImg
        email
        overallRole
        worksAt(development: $worksAt) {
          developmentRole
        }
      }
    }
  }
`;

const UPDATE_DEVELOPMENT_ROLE = gql`
  mutation userUpdateDevelopmentRole($user: ID!, $development: ID!, $role: DevelopmentRole!) {
    userUpdateDevelopmentRole(user: $user, development: $development, role: $role)
  }
`;

const REMOVE_USER_FROM_DEVELOPMENT = gql`
  mutation userRemoveFromDevelopment($user: ID!, $development: ID!) {
    userRemoveFromDevelopment(user: $user, development: $development)
  }
`;

export { GET_MEMBERS, UPDATE_DEVELOPMENT_ROLE, REMOVE_USER_FROM_DEVELOPMENT };
