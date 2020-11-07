import { gql } from '@apollo/client';

const GET_USERS = gql`
  query users($search: UserSearchInput, $params: QueryParams) {
    users(search: $search, params: $params) {
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
        dateOfBirth
        profileImg
        overallRole
        createdAt
        updatedAt
      }
    }
  }
`;

export { GET_USERS };
