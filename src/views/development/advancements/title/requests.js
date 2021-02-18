import { gql } from '@apollo/client';

const GET_PROVIDERS = gql`
  query providers($search: ProviderSearchInput, $params: QueryParams, $worksAt: QueryOperators) {
    providers(search: $search, params: $params, worksAt: $worksAt) {
      results {
        id
        businessName
        RFC
      }
    }
  }
`;

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

const GET_WORKLOADS = gql`
  query workloads($id: QueryOperators, $params: QueryParams, $development: QueryOperators) {
    workloads(id: $id, params: $params, development: $development) {
      results {
        id
        folio
      }
    }
  }
`;

export { GET_PROVIDERS, GET_USERS, GET_ALLOTMENTS, GET_BLOCKS, GET_WORKLOADS };
