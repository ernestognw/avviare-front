import { gql } from '@apollo/client';

const GET_PROVIDERS = gql`
  query providers($search: ProviderSearchInput, $params: QueryParams) {
    providers(search: $search, params: $params) {
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
        worksAt {
          id
          logo
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export { GET_PROVIDERS };
