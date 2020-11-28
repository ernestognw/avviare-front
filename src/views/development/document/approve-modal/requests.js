import { gql } from '@apollo/client';

const APPROVE_DOCUMENT_VERSION = gql`
  mutation documentVersionApprove($id: ID!, $password: String!) {
    documentVersionApprove(id: $id, password: $password) {
      id
    }
  }
`;

export { APPROVE_DOCUMENT_VERSION };
