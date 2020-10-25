import { ApolloClient, InMemoryCache } from '@apollo/client';
import { apiUrl } from '@config/environment';

const client = new ApolloClient({
  uri: apiUrl,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
