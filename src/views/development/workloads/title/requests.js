import { gql } from '@apollo/client';

const GET_PROVIDERS = gql`
  query providers($search: ProviderSearchInput, $params: QueryParams, $worksAt: QueryOperators) {
    providers(search: $search, params: $params, worksAt: $worksAt) {
      results {
        id
        businessName
        RFC
      }
    }
  }
`;

const GET_USERS = gql`
  query users($search: UserSearchInput, $params: QueryParams, $worksAt: QueryOperators) {
    users(search: $search, params: $params, worksAt: $worksAt) {
      results {
        id
        firstName
        lastName
        profileImg
        username
      }
    }
  }
`;

export { GET_PROVIDERS, GET_USERS };
