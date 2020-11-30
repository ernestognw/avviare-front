import { gql } from '@apollo/client';
import { documentInfo } from '../requests';

const GET_DOCUMENT = gql`
  query document($id: ID!) {
    document(id: $id) {
      id
      name
      description
      categories
      hiddenForRoles
    }
  }
`;

const UPDATE_DOCUMENT = gql`
  mutation updateDocument($id: ID!, $document: DocumentUpdateInput!) {
    updateDocument(id: $id, document: $document){
      ${documentInfo}
    }
  }
`;

export { GET_DOCUMENT, UPDATE_DOCUMENT };
