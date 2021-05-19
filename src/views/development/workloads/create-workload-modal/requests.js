import { gql } from '@apollo/client';

const CREATE_WORKLOAD = gql`
  mutation createWorkload($workload: WorkloadCreateInput!) {
    createWorkload(workload: $workload) {
      id
    }
  }
`;

export { CREATE_WORKLOAD };
