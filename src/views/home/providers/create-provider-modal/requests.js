import { gql } from '@apollo/client';

const CREATE_PROVIDER = gql`
  mutation createProvider($provider: ProviderCreateInput!) {
    createProvider(provider: $provider) {
      id
    }
  }
`;

export { CREATE_PROVIDER };
