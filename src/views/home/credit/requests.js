import { gql } from '@apollo/client';

// Used on edit credit modal.
// Should fetch the same query so cache could update credit withouth refetching the entire list
const creditMovementInfo = `
  id
  credit {
    id
    addTIIE
    interestRate
  }
  date
  type
  amount
  notes
  TIIE
  calculations {
    balance
    interests
    dailyInterestRate
    daysDifference
  }
  createdAt
  updatedAt
`;

const GET_CREDIT_MOVEMENTS = gql`
  query creditMovements(
    $params: QueryParams,
    $credit: QueryOperators
    $type: CreditMovementType,
    $date: DateRange,
    $sortBy: CreditMovementSortInput
    $createdAt: DateRange,
    $updatedAt: DateRange,
  ) {
    creditMovements(
      params: $params
      credit: $credit
      type: $type
      date: $date
      sortBy: $sortBy
      createdAt: $createdAt
      updatedAt: $updatedAt
    ) {
      info {
        count
        pages
      }
      results {
        ${creditMovementInfo}
      }
    }
  }
`;

export { creditMovementInfo, GET_CREDIT_MOVEMENTS };
