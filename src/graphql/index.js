import { ApolloClient, InMemoryCache } from '@apollo/client';
import { apiUrl } from '@config/environment';

const client = new ApolloClient({
  uri: apiUrl,
  credentials: 'include',
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
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
