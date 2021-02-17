import { gql } from '@apollo/client';

const GET_ADVANCEMENTS = gql`
  query advancements(
    $params: QueryParams
    $sortBy: AdvancementSortInput
    $createdBy: QueryOperators
    $provider: QueryOperators
    $development: QueryOperators
    $allotment: QueryOperators
    $block: QueryOperators
    $workload: QueryOperators
    $createdAt: DateRange
    $updatedAt: DateRange
  ) {
    advancements(
      params: $params
      sortBy: $sortBy
      createdBy: $createdBy
      provider: $provider
      development: $development
      allotment: $allotment
      block: $block
      workload: $workload
      createdAt: $createdAt
      updatedAt: $updatedAt
    ) {
      info {
        count
      }
      results {
        id
        createdBy {
          id
          username
          firstName
          lastName
          profileImg
        }
        subconceptInstance {
          id
          subconcept {
            id
            code
            name
          }
          allotment {
            id
            number
          }
        }
        provider {
          id
          businessName
          RFC
        }
        workload {
          id
        }
        percentageAdvanced
        createdAt
        updatedAt
      }
    }
  }
`;

export { GET_ADVANCEMENTS };
