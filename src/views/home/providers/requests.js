import { gql } from '@apollo/client';

// Used on edit provider modal.
// Should fetch the same query so cache could update provider withouth refetching the entire list
const providerInfo = `
  id
  businessName
  RFC
  contactFirstName
  contactLastName
  contactEmail
  contactPhone
  creditDays
  worksAt {
    development {
      id
      logo
      name
    }
  }
  createdAt
  updatedAt
`;

const GET_PROVIDERS = gql`
  query providers($search: ProviderSearchInput, $params: QueryParams) {
    providers(search: $search, params: $params) {
      info {
        count
        pages
      }
      results {
        ${providerInfo}
      }
    }
  }
`;

export { providerInfo, GET_PROVIDERS };
