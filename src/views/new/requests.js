import { gql } from '@apollo/client';

const CREATE_DEVELOPMENT = gql`
  mutation createDevelopment($development: DevelopmentCreateInput!) {
    createDevelopment(development: $development) {
      id
    }
  }
`;

export { CREATE_DEVELOPMENT };
