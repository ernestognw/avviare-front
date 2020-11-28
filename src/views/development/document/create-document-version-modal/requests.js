import { gql } from '@apollo/client';

const CREATE_DOCUMENT_VERSION = gql`
  mutation createDocumentVersion($document: ID!, $documentVersion: DocumentVersionCreateInput!) {
    createDocumentVersion(document: $document, documentVersion: $documentVersion) {
      id
    }
  }
`;

export { CREATE_DOCUMENT_VERSION };
