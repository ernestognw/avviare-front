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

export { GET_PROVIDERS };
