import { gql } from '@apollo/client';

const GET_WORKLOADS = gql`
  query workloads(
    $params: QueryParams
    $sortBy: WorkloadSortInput
    $createdBy: QueryOperators
    $provider: QueryOperators
    $development: QueryOperators
    $createdAt: DateRange
    $updatedAt: DateRange
    $start: DateRange
    $end: DateRange
  ) {
    workloads(
      params: $params
      sortBy: $sortBy
      createdBy: $createdBy
      provider: $provider
      development: $development
      createdAt: $createdAt
      updatedAt: $updatedAt
      start: $start
      end: $end
    ) {
      info {
        count
      }
      results {
        id
        start
        end
        paid
        createdBy {
          id
          username
          firstName
          lastName
          profileImg
        }
        provider {
          id
          businessName
          RFC
        }
        advancements {
          info {
            count
          }
        }
      }
    }
  }
`;

export { GET_WORKLOADS };
