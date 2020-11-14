import { gql } from '@apollo/client';

const GET_MY_DEVELOPMENTS = gql`
  query developments(
    $search: DevelopmentSearchInput
    $params: QueryParams
    $user: QueryField!
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
          info {
            count
          }
          results {
            id
            firstName
            lastName
            profileImg
          }
        }
      }
    }
  }
`;

export { GET_MY_DEVELOPMENTS };
