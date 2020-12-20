import { gql } from '@apollo/client';
import { providerInfo } from '../requests';

const UPDATE_PROVIDER = gql`
  mutation updateProvider($id: ID!, $provider: ProviderUpdateInput!) {
    updateProvider(id: $id, provider: $provider) {
      ${providerInfo}
    }
  }
`;

const GET_PROVIDER = gql`
  query provider($id: ID!) {
    provider(id: $id) {
      id
      businessName
      RFC
      contactFirstName
      contactLastName
      contactEmail
      contactPhone
      creditDays
    }
  }
`;

export { UPDATE_PROVIDER, GET_PROVIDER };
