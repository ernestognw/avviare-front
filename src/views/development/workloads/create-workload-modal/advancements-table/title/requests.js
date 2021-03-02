import { gql } from '@apollo/client';

const GET_USERS = gql`
  query users($search: UserSearchInput, $params: QueryParams, $worksAt: QueryOperators) {
    users(search: $search, params: $params, worksAt: $worksAt) {
      results {
        id
        firstName
        lastName
        profileImg
        username
      }
    }
  }
`;

const GET_ALLOTMENTS = gql`
  query allotments(
    $search: AllotmentSearchInput
    $params: QueryParams
    $development: QueryOperators
  ) {
    allotments(search: $search, params: $params, development: $development) {
      results {
        id
        number
      }
    }
  }
`;

const GET_BLOCKS = gql`
  query blocks($search: BlockSearchInput, $params: QueryParams, $development: QueryOperators) {
    blocks(search: $search, params: $params, development: $development) {
      results {
        id
        number
      }
    }
  }
`;

export { GET_USERS, GET_ALLOTMENTS, GET_BLOCKS };
