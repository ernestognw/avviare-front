import { gql } from '@apollo/client';

// Used on edit user modal.
// Should fetch the same query so cache could update user withouth refetching the entire list
const userInfo = `
  id
  username
  firstName
  lastName
  profileImg
  email
  dateOfBirth
  overallRole
  createdAt
  updatedAt
`;

const GET_USERS = gql`
  query users($search: UserSearchInput, $params: QueryParams) {
    users(search: $search, params: $params) {
      info {
        count
        pages
      }
      results {
        ${userInfo}
      }
    }
  }
`;

export { userInfo, GET_USERS };
