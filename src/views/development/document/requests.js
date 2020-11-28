import { gql } from '@apollo/client';

const documentInfo = `
  id
  name
  description
  categories
  versions {
    info {
      count
    }
    results {
      id
      fileSource
      approvedBy {
        approvalDate
        user {
          id
          username
          firstName
          lastName
          profileImg
        }
      }
      createdAt
      version
    }
  }
  finalVersion {
    id
    version
  }
  lastVersion {
    id
    version
  }
`;

const GET_DOCUMENT = gql`
  query document($id: ID!) {
    document(id: $id) {
      ${documentInfo}
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
