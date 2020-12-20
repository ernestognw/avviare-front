import { gql } from '@apollo/client';

const ADD_PROVIDER_TO_DEVELOPMENT = gql`
  mutation providerAddToDevelopment($provider: ID!, $development: ID!) {
    providerAddToDevelopment(provider: $provider, development: $development)
  }
`;

const SEARCH_PROVIDERS = gql`
  query providers($worksAt: QueryOperators, $search: ProviderSearchInput, $params: QueryParams) {
    providers(worksAt: $worksAt, search: $search, params: $params) {
      results {
        id
        businessName
        RFC
      }
    }
  }
`;

export { ADD_PROVIDER_TO_DEVELOPMENT, SEARCH_PROVIDERS };
