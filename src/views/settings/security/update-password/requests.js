import { gql } from '@apollo/client';

const UPDATE_PASSWORD = gql`
  mutation updateUserPassword($newPassword: String!, $oldPassword: String!) {
    updateUserPassword(newPassword: $newPassword, oldPassword: $oldPassword)
  }
`;

export { UPDATE_PASSWORD };
