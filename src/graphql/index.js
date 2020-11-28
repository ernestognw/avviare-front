import { ApolloClient, InMemoryCache } from '@apollo/client';
import { apiUrl } from '@config/environment';

const client = new ApolloClient({
  uri: apiUrl,
  credentials: 'include',
  cache: new InMemoryCache({
    typePolicies: {
      Document: {
        fields: {
          versions: {
            merge: true,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
