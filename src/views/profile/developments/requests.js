import { gql } from '@apollo/client';

const GET_DEVELOPMENTS = gql`
  query developments(
    $search: DevelopmentSearchInput
    $params: QueryParams
    $user: Filter!
    $sortBy: DevelopmentSortInput
  ) {
    developments(search: $search, params: $params, user: $user, sortBy: $sortBy) {
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

export { GET_DEVELOPMENTS };
