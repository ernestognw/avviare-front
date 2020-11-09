import { gql } from '@apollo/client';

const GET_MEMBERS = gql`
  query users($development: Filter, $search: UserSearchInput, $params: QueryParams) {
    users(development: $development, search: $search, params: $params) {
      info {
        count
        pages
      }
      results {
        id
        username
        firstName
        lastName
        profileImg
        email
        overallRole
        worksAt {
          developmentRole
        }
      }
    }
  }
`;

export { GET_MEMBERS };
