import { gql } from '@apollo/client';

const CREATE_DOCUMENT = gql`
  mutation createDocument($document: DocumentCreateInput!) {
    createDocument(document: $document) {
      id
    }
  }
`;

export { CREATE_DOCUMENT };
