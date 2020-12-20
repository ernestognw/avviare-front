import { gql } from '@apollo/client';

const RFC_EXISTS = gql`
  query providerRFCExists($RFC: String!) {
    providerRFCExists(RFC: $RFC)
  }
`;

export { RFC_EXISTS };
