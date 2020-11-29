import { gql } from '@apollo/client';

const APPROVE_DOCUMENT_VERSION = gql`
  mutation documentVersionApprove($id: ID!, $development: ID!, $password: String!) {
    documentVersionApprove(id: $id, development: $development, password: $password) {
      id
    }
  }
`;

export { APPROVE_DOCUMENT_VERSION };
