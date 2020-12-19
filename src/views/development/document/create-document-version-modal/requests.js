import { gql } from '@apollo/client';

const CREATE_DOCUMENT_VERSION = gql`
  mutation createDocumentVersion($documentVersion: DocumentVersionCreateInput!) {
    createDocumentVersion(documentVersion: $documentVersion) {
      id
    }
  }
`;

export { CREATE_DOCUMENT_VERSION };
