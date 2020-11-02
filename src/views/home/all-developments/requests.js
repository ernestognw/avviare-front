import { gql } from '@apollo/client';

const GET_MY_DEVELOPMENTS = gql`
  query developments(
    $search: DevelopmentSearchInput
    $params: QueryParams
    $sortBy: DevelopmentSortInput
  ) {
    developments(search: $search, params: $params, sortBy: $sortBy) {
      info {
        count
        pages
      }
      results {
        id
        name
        logo
        cover
        startDate
        active
        workers {
          id
          firstName
          lastName
          profileImg
        }
      }
    }
  }
`;

export { GET_MY_DEVELOPMENTS };
