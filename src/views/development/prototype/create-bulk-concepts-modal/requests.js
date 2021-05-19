import { gql } from '@apollo/client';

const CREATE_BULK_CONCEPTS = gql`
  mutation createBulkConcepts($template: Upload!, $allotmentPrototype: ID!) {
    createBulkConcepts(template: $template, allotmentPrototype: $allotmentPrototype)
  }
`;

export { CREATE_BULK_CONCEPTS };
