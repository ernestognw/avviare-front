import { gql } from '@apollo/client';

const GET_ADVANCEMENTS = gql`
  query advancements(
    $id: QueryOperators
    $search: AdvancementSearchInput
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
      id: $id
      search: $search
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
        folio
        createdBy {
          id
          username
          firstName
          lastName
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
        percentageAdvanced
        createdAt
        updatedAt
      }
    }
  }
`;

export { GET_ADVANCEMENTS };
