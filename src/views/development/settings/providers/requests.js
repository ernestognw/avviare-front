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

export { GET_PROVIDERS };
