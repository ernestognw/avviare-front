import { gql } from '@apollo/client';

const ADD_USER_TO_DEVELOPMENT = gql`
  mutation userAddToDevelopment($user: ID!, $development: ID!, $role: DevelopmentRole!) {
    userAddToDevelopment(user: $user, development: $development, role: $role)
  }
`;

const SEARCH_USERS = gql`
  query users($development: QueryField, $search: UserSearchInput, $params: QueryParams) {
    users(development: $development, search: $search, params: $params) {
      results {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export { ADD_USER_TO_DEVELOPMENT, SEARCH_USERS };
