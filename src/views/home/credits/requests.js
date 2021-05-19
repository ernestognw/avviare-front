import { gql } from '@apollo/client';

// Used on edit credit modal.
// Should fetch the same query so cache could update credit withouth refetching the entire list
const creditInfo = `
  id
  number
  bank
  end
  TIIEDay
  billingDay
  paymentDay
  defaultInterestRate
  interestRate
  addTIIE
`;

const GET_CREDITS = gql`
  query credits(
    $search: CreditSearchInput,
    $params: QueryParams,
    $type: CreditType,
    $bank: QueryOperators,
    $end: DateRange,
    $createdAt: DateRange,
    $updatedAt: DateRange,
  ) {
    credits(
      search: $search, 
      params: $params
      type: $type
      bank: $bank
      end: $end
      createdAt: $createdAt
      updatedAt: $updatedAt
    ) {
      info {
        count
        pages
      }
      results {
        ${creditInfo}
      }
    }
  }
`;

export { creditInfo, GET_CREDITS };
