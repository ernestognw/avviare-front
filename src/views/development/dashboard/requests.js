import { gql } from '@apollo/client';

const DASHBOARD_METRICS = gql`
  query dashboardMetrics($developmentId: ID!, $development: QueryOperators!) {
    development(id: $developmentId) {
      id
      progress
    }
    documents(development: $development) {
      info {
        count
      }
    }
    allotmentPrototypes(development: $development) {
      info {
        count
      }
    }
    allotments(development: $development) {
      info {
        count
      }
    }
  }
`;

export { DASHBOARD_METRICS };
