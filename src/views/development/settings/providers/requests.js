import { gql } from '@apollo/client';

const GET_PROVIDERS = gql`
  query providers($search: ProviderSearchInput, $params: QueryParams, $worksAt: QueryOperators) {
    providers(search: $search, params: $params, worksAt: $worksAt) {
      info {
        count
        pages
      }
      results {
        id
        businessName
        RFC
        contactFirstName
        contactLastName
        contactEmail
        contactPhone
        creditDays
        worksAt(development: $worksAt) {
          addedAt
        }
      }
    }
  }
`;

const REMOVE_PROVIDER_FROM_DEVELOPMENT = gql`
  mutation providerRemoveFromDevelopment($provider: ID!, $development: ID!) {
    providerRemoveFromDevelopment(provider: $provider, development: $development)
  }
`;

export { GET_PROVIDERS, REMOVE_PROVIDER_FROM_DEVELOPMENT };
