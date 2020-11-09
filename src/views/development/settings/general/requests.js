import { gql } from '@apollo/client';

const UPDATE_DEVELOPMENT = gql`
  mutation updateDevelopment($id: ID!, $development: DevelopmentUpdateInput!) {
    updateDevelopment(id: $id, development: $development) {
      id
    }
  }
`;

export { UPDATE_DEVELOPMENT };
